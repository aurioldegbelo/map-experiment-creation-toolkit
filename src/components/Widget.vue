<template>
    <div class="widget">
        <TextWidget v-if="isTextWidget"
            :heading="properties?.heading"
            :text="properties?.text"
        >
        </TextWidget>
        <InputWidget v-if="isInputWidget"
            :question="properties?.question" 
            :type="properties?.type"
            :properties="properties?.properties"
            @value-changed="value => onValueChange(value)"
        >
        </InputWidget>
        <MapWidget v-if="isMapWidget"
            :title="properties?.title" 
            :data="properties?.data"
            :classificationMethod="properties?.classificationMethod" 
            :colorScheme="properties?.colorScheme"
            :classLabels="properties?.classLabels"
        >
        </MapWidget>
        <ConsentWidget v-if="isConsentWidget"
            v-model="checked"
            @checked="e => onConsentChecked(e)"
        >
        </ConsentWidget>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { Widget, PropertyWidget } from '../types/Widget';

import TextWidget from './widgets/TextWidget.vue';
import InputWidget from './widgets/InputWidget.vue';
import MapWidget from './widgets/MapWidget.vue';
import ConsentWidget from './widgets/ConsentWidget.vue';

type WidgetData = {
    checked: boolean
}

export default {
    components: {
        TextWidget,
        InputWidget,
        MapWidget,
        ConsentWidget
    },
    props: {
        type: {
            type: String as PropType<Widget["type"]>,
            required: true
        },
        properties: {
            type: Object as PropType<PropertyWidget["properties"]>,
            required: false
        }
    },
    data(): WidgetData {
        return {
            checked: false
        }
    },
    computed: {
        isTextWidget(): boolean {
            return this.type === 'TEXT';
        },
        isInputWidget(): boolean {
            return this.type === 'INPUT';
        },
        isMapWidget(): boolean {
            return this.type === 'MAP';
        },
        isConsentWidget(): boolean {
            return this.type === 'CONSENT';
        }
    },
    methods: {
        onValueChange(value) {
            const obj = {
                question: this.properties?.question,
                answer: value
            };

            this.$emit('value-changed', obj);
        },
        onConsentChecked(value) {
            this.$emit('consent-checked', value);
        }
    }
}
</script>