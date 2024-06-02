<template>
    <TextWidget v-if="type === 'text'"></TextWidget>
    <LikertWidget v-else-if="type === 'likert'"></LikertWidget>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        type: String
    }
});
</script>