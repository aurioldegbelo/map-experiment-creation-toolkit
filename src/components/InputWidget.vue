<template>
    <h4>{{ question }}</h4>
    <TextInputWidget v-if="type === 'text'"
        :singleLine="properties.singleLine"
        :length="properties.length"
    >
    </TextInputWidget>
    <LikertInputWidget v-if="type === 'likert'"
        :options="properties.options"
    >
    </LikertInputWidget>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { InputWidgetPropertiesProperties, InputWidgetType } from '@/types/widgets/InputWidget';

import TextInputWidget from './TextInputWidget.vue';
import LikertInputWidget from './LikertInputWidget.vue';

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
    }
}
</script>