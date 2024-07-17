<template>
    <h4>{{ heading }}</h4>
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
    },
    mounted() {
        console.log(this.heading);
        console.log(this.text);
    }
}
</script>