<template>
    <v-radio-group 
        v-model="selectedValue"
        color="#89be31"
    >
        <v-radio v-for="item in items" 
            :label="item" 
            :value="item"
        ></v-radio>
    </v-radio-group>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { LikertInputWidget } from '@/types/widgets/inputs/LikertInputWidget';

export default {
    props: {
        items: {
            type: Array as PropType<LikertInputWidget["items"]>
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