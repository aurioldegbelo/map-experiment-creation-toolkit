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
            >
                Previous
            </v-btn>
            <v-btn
                color="primary"
                @click="onNextButton()"
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
    data: Array<object>
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
            data: []
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
            const jsonString = JSON.stringify(this.data);

            const blob = new Blob([jsonString], {
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
        }
    }
};
</script>
