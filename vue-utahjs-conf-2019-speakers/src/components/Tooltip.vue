<template>
    <div class="tooltip-container">
        <span tooltip tooltip-right :tooltip-content="content" v-html="content"></span> 
    </div>
</template>

<script>
export default {
    props: {
        content: String,
    }
}
</script>

<style lang="scss" scoped>
.tooltip-container {
    [tooltip] {
        position: relative;
    }
    [tooltip]::before {
        content: attr(tooltip-content);
        display: block;
        position: absolute;
        top: 50%;
        right: calc(100% + 16px);
        width: 235%;
        padding: 8px 16px;
        text-align: center;
        text-transform: none;
        font-size: 14px;
        border-radius: 3px;
        background: black;
        opacity: 0;
        transform: translate(20px, -50%);
        transition: all .2s ease-in-out .5s;
        z-index: 1;
    }
    [tooltip]:hover::before {
        opacity: 1;
        transform: translate(0, -50%);
    }    

    [tooltip-bottom]::before {
        top: calc(100% + 16px);
        left: 50%;
        right: initial;
        transform: translate(-50%, -20px);
    }
    [tooltip-bottom]:hover::before {
        transform: translate(-50%, 0)
    }
    [tooltip-right]::before {
        top: 50%;
        left: calc(100% + 16px);
        right: initial;
        transform: translate(-20px, -50%);
    }
    [tooltip-right]:hover::before {
        transform: translate(0, -50%);
    }
    [tooltip-top]::before {
        top: initial;
        left: 50%;
        right: initial;
        bottom: calc(100% + 16px);
        transform: translate(-50%, 20px);
    }
    [tooltip-top]:hover::before {
        transform: translate(-50%, 0);
    }    
}
</style>