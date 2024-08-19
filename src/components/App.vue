<template>
    <v-app>
        <v-app-bar flat :title="title"></v-app-bar>
        <v-main>
            <TaskNavigation v-model="step" :tasks="tasks">
            </TaskNavigation>
        </v-main>
        <v-footer app>
            <v-stepper-actions @click:prev="step--" @click:next="step++"></v-stepper-actions>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import type { Experiment } from '../types/Experiment';
import type { Task } from '../types/Task';

import TaskNavigation from './TaskNavigation.vue';

type AppData = {
    experiment: Experiment,
    step: number
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
            step: 1
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
        }
    }
};
</script>
