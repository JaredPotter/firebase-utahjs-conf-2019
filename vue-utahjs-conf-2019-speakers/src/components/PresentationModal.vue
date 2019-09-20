<template>
    <div class="presentation-modal-container">
        <h1>{{ presentation.title }}</h1>
        <div>{{ presentation.description }}</div>
        <button @click="close()" class="button">Close</button>
    </div>
</template>

<script>
export default {
    props: {
        presentation: Object,
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="scss">
.presentation-modal-container {
    background: white;
    padding: 15px;
}
</style>