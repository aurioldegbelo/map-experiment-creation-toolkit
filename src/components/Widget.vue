<template>
    <div class="widget">
        <TextWidget v-if="type === 'text'"
            :heading="properties.heading" 
            :text="properties.text"
        >
        </TextWidget>
        <InputWidget v-if="type === 'input'"
            :question="properties.question" 
            :type="properties.type"
            :properties="properties.properties"
            @value-changed="value => onValueChange(value)"
        >
        </InputWidget>
        <MapWidget v-if="type === 'map'"
            :title="properties.title" 
            :data="properties.data"
            :variable="properties.variable" 
            :classificationMethod="properties.classificationMethod" 
            :colorScheme="properties.colorScheme"
        >
        </MapWidget>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { WidgetProperties } from '../types/widgets/Widget';

import { WidgetType } from '../types/widgets/Widget';

import TextWidget from './TextWidget.vue';
import InputWidget from './InputWidget.vue';
import MapWidget from './MapWidget.vue';

export default {
    components: {
        TextWidget,
        InputWidget,
        MapWidget
    },
    props: {
        type: {
            type: String as PropType<WidgetType>,
            required: true
        },
        properties: {
            type: Object as PropType<WidgetProperties>,
            required: true
        }
    },
    methods: {
        onValueChange(value) {
            const obj = {
                id: this.properties.question,
                value: value
            };

            this.$emit('value-changed', obj);
        }
    }
}
</script>