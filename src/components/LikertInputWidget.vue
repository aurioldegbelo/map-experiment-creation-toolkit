<template>
    <v-radio-group 
        v-model="selectedValue"
        color="#89be31"
    >
        <v-radio v-for="option in options" 
            :label="option" 
            :value="option"
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
            type: String,
            default: ''
        }
    },
    computed: {
        selectedValue: {
            get(): string {
                return this.value;
            },
            set(value: string): void {
                this.$emit('value-changed', value);
            }
        }
    }
};
</script>