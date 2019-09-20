<template>
    <div class="modal-container" @click.self="onClose()">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        onClose() {
            this.$emit('close');
        }
    }
}
</script>

<style lang="scss">
.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 50;

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        border: 2px solid rgba(0, 0, 0, 0.26);
    }
}
</style>