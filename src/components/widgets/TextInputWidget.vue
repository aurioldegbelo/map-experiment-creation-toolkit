<template>
    <v-text-field
        v-if="singleLine"
        v-model="enteredValue"
        clearable
        color="primary"
        density="compact"
        :minLength="minLength"
        :maxLength="maxLength"
        :rules="rules"
        :type="type"
        variant="outlined"
    ></v-text-field>
    <v-textarea v-else
        v-model="enteredValue"
        clearable
        color="primary"
        :counter="maxLength"
        density="compact"
        :minLength="minLength"
        :maxLength="maxLength"
        :type="type"
        variant="outlined"
    >
    </v-textarea>
</template>

<script lang="ts">
import type { TextInputWidget } from '@/types/widgets/inputs/MapWidget'
import type { PropType } from 'vue';
import type { VTextField } from 'vuetify/components';

type TextInputWidgetData = {
    rules: VTextField['$props']['rules']
}

export default {
    props: {
        singleLine: {
            type: Boolean,
            required: true
        },
        minLength: {
            type: Number,
            required: false
        },
        maxLength: {
            type: Number,
            required: false
        },
        type: {
            type: String as PropType<TextInputWidget["type"]>,
            required: false
        },
        value: {
            type: String,
            required: false,
            default: ''
        }
    },
    data(): TextInputWidgetData {
        return {
            rules: [
                value => !!value || 'This value is required.'
            ]
        }
    },
    computed: {
        enteredValue: {
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