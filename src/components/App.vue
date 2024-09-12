<template>
    <v-app>
        <v-app-bar
            flat 
            :title="title"
        ></v-app-bar>
        <v-main>
            <v-container>
                <TaskNavigation
                    :value="step"
                    :description="description"
                    :authors="authors"
                    :measureTaskCompletionTime="measureTaskCompletionTime"
                    :tasks="tasks"
                    @values-changed="e => updateData(e)"
                    @consent-checked="e => onConsentChecked(e)"
                ></TaskNavigation>
            </v-container>
        </v-main>
        <v-footer 
            app
        >
            <v-btn
                variant="outlined"
                color="primary"
                @click="onPreviousButton()"
                :disabled="!consent || step === 1 || measureTaskCompletionTime"
            >
                Previous
            </v-btn>
            <v-btn
                color="primary"
                @click="onNextButton()"
                :disabled="!consent"
            >
                {{ step >= tasks.length ? "Submit" : "Next" }}
            </v-btn>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import type { Experiment } from '@/types/Experiment';
import type { Author } from '@/types/Author';
import type { Task } from '@/types/Task';
import type { ExperimentLog } from '@/types/Log';

import TaskNavigation from './TaskNavigation.vue';

type AppData = {
    experiment: Experiment,
    step: number,
    answers: ExperimentLog["answers"],
    consent: boolean,
    timestamps: number[]
}

export default {
    components: {
        TaskNavigation
    },
    data(): AppData {
        return {
            experiment: {
                title: "",
                description: "",
                authors: [],
                measureTaskCompletionTime: false,
                tasks: []
            },
            step: 1,
            answers: [],
            consent: false,
            timestamps: []
        }
    },
    computed: {
        title(): Experiment["title"] {
            return this.experiment?.title;
        },
        description(): Experiment["description"] {
            return this.experiment?.description;
        },
        authors(): Author[] {
            return this.experiment?.authors;
        },
        measureTaskCompletionTime(): Experiment["measureTaskCompletionTime"] {
            return this.experiment?.measureTaskCompletionTime;
        },
        tasks(): Task[] {
            return this.experiment?.tasks;
        },
        timeMeasurements(): ExperimentLog["taskCompletionTimes"] {
            return this.timestamps.map((timestamp, index) => {
                const difference = index < 1 ? 0 : (timestamp - this.timestamps[index - 1]);
                const measurement = new Date(difference).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });

                return {
                    taskId: index,
                    time: measurement
                }
            });
        }
    },
    mounted() {
        this._init();
    },
    methods: {
        async _init() {
            const source = `/data/experiments/${import.meta.env.VITE_EXPERIMENT_ID}/config.json`;
            this.experiment = await (await fetch(source)).json();
        },
        onPreviousButton() {
            this._previousStep();
        },
        onNextButton() {
            if (this.measureTaskCompletionTime) {
                const timestamp = Date.now();
                this.timestamps.push(timestamp);
            }

            this.step >= this.tasks.length ? this._submit() : this._nextStep();
        },
        _previousStep() {
            if (this.step <= 1) {
                return;
            }

            this.step--;
        },
        _nextStep() {
            if (this.step >= this.tasks.length) {
                return;
            }

            this.step++;
        },
        _submit() {
            const logFile = this._generateLogFile();
            this._downloadLogFile(logFile);
        },
        _generateLogFile(): Blob {
            const log: ExperimentLog = {
                experimentId: import.meta.env.VITE_EXPERIMENT_ID,
                timestamp: new Date().toLocaleString(),
                answers: this.answers
            };

            this.measureTaskCompletionTime && Object.assign(log, { timeMeasurements: this.timeMeasurements });

            const logString = JSON.stringify(log);

            return new Blob([logString], {
                type: 'application/json'
            });
        },
        _downloadLogFile(file: Blob) {
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'log.json');
            link.click();
        },
        updateData(values: Answer[]) {
            this.answers = values;
        },
        onConsentChecked(value: boolean) {
            this.consent = value;
        }
    }
};
</script>
