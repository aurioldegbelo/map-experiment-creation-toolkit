<template>
    <h4 v-if="heading">
        {{ heading }}
    </h4>
    <p>{{ text }}</p>
</template>

<script lang="ts">
export default {
    props: {
        heading: {
            type: String,
            required: false,
            default: ""
        },
        text: {
            type: String,
            required: true
        }
    }
}
</script>