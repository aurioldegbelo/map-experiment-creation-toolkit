<template>
    <v-app>
        <v-app-bar 
            flat
            :title="title"
        ></v-app-bar>
        <v-main>
            <v-stepper
                v-model="step"
                alt-labels
            >
                <v-stepper-header>
                    <template v-for="(title, index) in taskTitles">
                        <v-stepper-item 
                            :title="title"
                            :value="index + 1"
                        ></v-stepper-item>
                    </template>
                </v-stepper-header>
                <v-stepper-window>
                    <template v-for="(title, index) in taskTitles">
                        <v-stepper-window-item :value="index + 1">
                            <v-card :title="title">
                                Lorem ipsum blablabla
                            </v-card>
                        </v-stepper-window-item>
                    </template>
                </v-stepper-window>
            </v-stepper>
        </v-main>
        <v-footer app>
            <v-stepper-actions></v-stepper-actions>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import data from '../data/experiments/UncertaintyViz/experiment.json';

type Author = {
    title?: string,
    firstName: string,
    lastName: string,
    email: string
}

enum WidgetType {
    "text",
    "input",
    "map"
}

type Widget = {
    type: string
    properties: Object
}

type Task = {
    title: string,
    widgets: Widget[]
}

type Experiment = {
    title: string,
    description: string,
    authors: Author[],
    tasks: Task[]
}

export default {
    data() {
        return {
            experiment: {} as Experiment,
            title: "" as string,
            taskTitles: [] as string[],
            step: 1 as number
        }
    },
    computed: {},
    methods: {},
    mounted() {
        this.experiment = data;
        this.title = this.experiment.title;
        this.taskTitles = this.experiment.tasks.map(task => task.title);
    }
};
</script>
