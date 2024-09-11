<template>
    <div class="input-widget">
        <h4>
            {{ question }}
        </h4>
        <TextInputWidget 
            v-if="type === 'text'"
            v-model="enteredValue"
            :singleLine="properties.singleLine" 
            :length="properties.length"
            @value-changed="(value: string) => onTextInputChange(value)"
        >
        </TextInputWidget>
        <LikertInputWidget 
            v-if="type === 'likert'"
            v-model="selectedOption"
            :options="properties.options"
            @value-changed="(value: number) => onLikertInputChange(value)"
        >
        </LikertInputWidget>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { InputWidgetPropertiesProperties, InputWidgetType } from '@/types/widgets/InputWidget';

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
        question: {
            type: String,
            required: true
        },
        type: {
            type: String as PropType<InputWidgetType>,
            required: true
        },
        properties: {
            type: Object as PropType<InputWidgetPropertiesProperties>,
            required: true
        }
    },
    data(): LikertInputWidgetData {
        return {
            selectedOption: -1,
            enteredValue: ''
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