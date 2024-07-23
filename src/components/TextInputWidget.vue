<template>
    {{ singleLine }}
    {{ length }}
</template>

<script lang="ts">
export default {
    props: {
        singleLine: {
            type: Boolean,
            required: true
        },
        length: {
            type: Number,
            required: false
        }
    }
};
</script>