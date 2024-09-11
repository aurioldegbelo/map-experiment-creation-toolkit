<template>
    <v-app>
        <v-app-bar
            flat 
            :title="title"
        ></v-app-bar>
        <v-main>
            <v-container>
                <TaskNavigation 
                v-model="step" 
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
                :disabled="!consent || step === 1"

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
import type { Experiment } from '../types/Experiment';
import type { Task } from '../types/Task';

import TaskNavigation from './TaskNavigation.vue';

type AppData = {
    experiment: Experiment,
    step: number,
    data: Array<object>,
    consent: boolean
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
                tasks: []
            },
            step: 1,
            data: [],
            consent: false
        }
    },
    computed: {
        title(): string {
            return this.experiment?.title;
        },
        tasks(): Task[] {
            return this.experiment?.tasks;
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
            const log = JSON.stringify({
                experiment: import.meta.env.VITE_EXPERIMENT_ID,
                timestamp: new Date().toLocaleString(),
                answers: this.data
            });

            const blob = new Blob([log], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'log.json';

            a.click();
        },
        updateData(values) {
            this.data = values;
        },
        onConsentChecked(value) {
            this.consent = value;
        }
    }
};
</script>
