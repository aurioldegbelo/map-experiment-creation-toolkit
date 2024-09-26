<template>
    <v-checkbox
        v-model="checked"
        label="I Agree."
    >
    </v-checkbox>
</template>

<script lang="ts">

export default {
    props: {
        value: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        checked: {
            get(): boolean {
                return this.value;
            },
            set(value: boolean): void {
                this.$emit('checked', value);
            }
        }
    }
}
</script>