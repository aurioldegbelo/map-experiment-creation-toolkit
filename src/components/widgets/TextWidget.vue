<template>
    <div class="text-widget">
        <h4 v-if="heading">
            {{ heading }}
        </h4>
        <p v-html="purifiedText"></p>
    </div>
</template>

<script lang="ts">
import DOMPurify from 'dompurify';

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
    computed: {
        purifiedText(): string {
            return DOMPurify.sanitize(this.text);
        }
    }
}
</script>