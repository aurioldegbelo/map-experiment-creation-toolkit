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
                    <v-card 
                        class="step"
                        :title="task.title">
                        <template v-for="widget in task.widgets">
                                <Widget 
                                    :type="widget.type"
                                    :properties="widget.properties"
                                    @value-changed="e => onValueChanged(e)"
                                >
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

type TaskNavigationData = {
    values: object[]
}

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
    data(): TaskNavigationData {
        return {
            values: []
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
    },
    methods: {
        onValueChanged(value) {
            const valueExists = this.values.some(x => {
                return x.id === value.id
            });

            if (valueExists) {
                const index = this.values.findIndex(x => x.id === value.id);
                const newValue = value.value;

                if (index > -1) {
                    this.values[index].value = newValue;
                }
            } else {
                this.values.push(value);
            }

            this.$emit('values-changed', this.values);
        }
    }
}
</script>