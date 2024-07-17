<template>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { InputWidgetPropertiesProperties, InputWidgetType } from '@/types/widgets/InputWidget';

export default {
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
    mounted() {
        console.log(this.question);
        console.log(this.type);
        console.log(this.properties);
    }
}
</script>