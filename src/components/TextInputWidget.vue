<template>
    <v-text-field
        v-if="singleLine"
        v-model="enteredValue"
        clearable
        color="primary"
        density="compact"
        :maxLength="length"
        :rules="rules"
        variant="outlined"
    ></v-text-field>
    <v-textarea v-else
        clearable
        color="primary"
        :counter="length"
        density="compact"
        :maxLength="length"
        variant="outlined"
    >
    </v-textarea>
</template>

<script lang="ts">
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
        length: {
            type: Number,
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