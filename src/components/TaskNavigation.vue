<template>
    <v-stepper v-model="selectedTask" alt-labels>
        <v-stepper-header>
            <template v-for="(task, index) in tasks">
                <v-stepper-item :title="task.title" :value="index + 1"></v-stepper-item>
            </template>
        </v-stepper-header>
        <v-stepper-window>
            <template v-for="(task, index) in tasks">
                <v-stepper-window-item :value="index + 1">
                    <v-card :title="task.title">
                        <template v-for="widget in task.widgets">
                            <Widget :type="widget.type" :properties="widget.properties">
                            </Widget>
                        </template>
                    </v-card>
                </v-stepper-window-item>
            </template>
        </v-stepper-window>
    </v-stepper>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Task } from '../types/Task';

import Widget from './Widget.vue';

export default {
    components: {
        Widget
    },
    props: {
        value: {
            type: Number,
            default: 1
        },
        tasks: {
            type: Array as PropType<Task[]>,
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