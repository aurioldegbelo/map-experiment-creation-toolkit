<template>
    <v-card :title="type"></v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { WidgetProperties } from '../types/widgets/Widget';

import { WidgetType } from '../types/widgets/Widget';

export default {
    props: {
        type: {
            type: String as PropType<WidgetType>,
            required: true
        },
        properties: {
            type: Object as PropType<WidgetProperties>,
            required: true
        }
    }
}
</script>