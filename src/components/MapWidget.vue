<template>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { ClassificationMethod } from '@/types/widgets/MapWidget';

export default {
    props: {
        title: {
            type: String,
            required: false,
            default: ""
        },
        data: {
            type: String,
            required: true
        },
        variableName: {
            type: String,
            required: true
        },
        numberOfClasses: {
            type: Number,
            required: false,
            default: 0
        },
        classificationMethod: {
            type: Number as PropType<ClassificationMethod>,
            required: true
        },
        colorScheme: {
            type: String,
            required: true
        }
    },
    mounted() {
        console.log(this.title);
        console.log(this.data);
        console.log(this.variableName);
        console.log(this.numberOfClasses);
        console.log(this.classificationMethod);
        console.log(this.colorScheme);
    },
}
</script>