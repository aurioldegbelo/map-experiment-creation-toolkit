<template>
    <div class="input-widget">
        <h4>
            {{ question }}
        </h4>
        <TextInputWidget 
            v-if="isTextInputWidget"
            v-model="enteredValue"
            :singleLine="properties.singleLine"
            :minLength="properties.minLength"
            :maxLength="properties.maxLength"
            :type="properties.type"
            @value-changed="(value: string) => onTextInputChange(value)"
        >
        </TextInputWidget>
        <LikertInputWidget 
            v-if="isLikertInputWidget"
            v-model="selectedOption"
            :items="properties.items"
            @value-changed="(value: number) => onLikertInputChange(value)"
        >
        </LikertInputWidget>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { InputWidget } from '@/types/widgets/InputWidget';

import TextInputWidget from './TextInputWidget.vue';
import LikertInputWidget from './LikertInputWidget.vue';

type LikertInputWidgetData = {
    selectedOption: number,
    enteredValue: string
}

export default {
    components: {
        TextInputWidget,
        LikertInputWidget
    },
    props: {
        type: {
            type: String as PropType<InputWidget["type"]>,
            required: true
        },
        question: {
            type: String as PropType<InputWidget["question"]>,
            required: true
        },
        properties: {
            type: Object as PropType<InputWidget["properties"]>,
            required: true
        }
    },
    data(): LikertInputWidgetData {
        return {
            selectedOption: -1,
            enteredValue: ''
        }
    },
    computed: {
        isTextInputWidget(): boolean {
            return this.type === 'TEXT';
        },
        isLikertInputWidget(): boolean {
            return this.type === 'LIKERT';
        }
    },
    methods: {
        onLikertInputChange(value: number) {
            this.$emit('value-changed', value);
        },
        onTextInputChange(value: string) {
            this.$emit('value-changed', value);
        }
    }
}
</script>