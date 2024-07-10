<template>
    <v-stepper
        v-model="selectedTask"
        alt-labels
    >
        <v-stepper-header>
            <template v-for="(task, index) in tasks">
                <v-stepper-item 
                    :title="task.title"
                    :value="index + 1"
                ></v-stepper-item>
            </template>
        </v-stepper-header>
        <v-stepper-window>
            <template v-for="(task, index) in tasks">
                <v-stepper-window-item :value="index + 1">
                    <v-card :title="task.title">
                        Lorem ipsum blablabla
                    </v-card>
                </v-stepper-window-item>
            </template>
        </v-stepper-window>
    </v-stepper>
</template>

<script lang="ts">
import type Task from '../types/Task';

export default {
    props: {
        value: {
            type: Number,
            default: 1
        },
        tasks: {
            type: Array<Task>,
            default: () => []
        }
    },
    computed: {
        selectedTask: {
            get() {
                return this.value;
            },
            set(value: number) {
                this.$emit('input', value);
            }
        }
    }
}
</script>