<template>
    <v-stepper
        v-model="selectedTask"
        alt-labels
    >
        <v-stepper-header>
            <template v-for="(task, index) in tasks">
                <v-stepper-item 
                    :editable="!measureTaskCompletionTime"
                    edit-icon=""
                    :title="task.title"
                    :value="index + 1"
                ></v-stepper-item>
            </template>
        </v-stepper-header>
        <v-stepper-window>
            <template v-for="(task, index) in tasks">
                <v-stepper-window-item 
                    :value="index + 1"
                >
                    <v-card 
                        class="step"
                        :title="task.title"
                    >
                        <template v-for="widget in task.widgets">
                            <Widget 
                                :type="widget.type"
                                :properties="widget.properties"
                                @value-changed="e => onValueChanged(e)"
                            ></Widget>
                        </template>
                        <Widget 
                            v-if="index === 0"
                            type="CONSENT"
                            @consent-checked="e => onConsentChecked(e)"
                        ></Widget>
                    </v-card>
                </v-stepper-window-item>
            </template>
        </v-stepper-window>
    </v-stepper>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Experiment } from '@/types/Experiment';

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
            required: true
        },
        description: {
            type: String as PropType<Experiment["description"]>,
            required: false, // TODO: Infer from type
            default: ""
        },
        authors: {
            type: Array as PropType<Experiment["authors"]>,
            required: true
        },
        measureTaskCompletionTime: {
            type: Boolean as PropType<Experiment["measureTaskCompletionTime"]>,
            required: false,
            default: false
        },
        tasks: {
            type: Array as PropType<Experiment["tasks"]>,
            required: true
        }
    },
    data(): TaskNavigationData {
        return {
            values: []
        }
    },
    computed: {
        selectedTask: {
            get(): number {
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
                return x.question === value.question
            });

            if (valueExists) {
                const index = this.values.findIndex(x => x.question === value.question);
                const newValue = value.answer;

                if (index > -1) {
                    this.values[index].answer = newValue;
                }
            } else {
                this.values.push(value);
            }

            this.$emit('values-changed', this.values);
        },
        onConsentChecked(value) {
            this.$emit('consent-checked', value);
        }
    }
}
</script>