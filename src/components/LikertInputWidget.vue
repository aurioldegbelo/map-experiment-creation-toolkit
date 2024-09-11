<template>
    <v-radio-group 
        v-model="selectedValue"
        color="#89be31"
    >
        <v-radio v-for="(option, index) in options" 
            :label="option" 
            :value="index"
        ></v-radio>
    </v-radio-group>
</template>

<script lang="ts">
import type { PropType } from 'vue';

export default {
    props: {
        options: {
            type: Array as PropType<String[]>
        },
        value: {
            type: Number,
            default: -1
        }
    },
    computed: {
        selectedValue: {
            get(): number {
                return this.value;
            },
            set(value: number): void {
                this.$emit('value-changed', value + 1);
            }
        }
    }
};
</script>