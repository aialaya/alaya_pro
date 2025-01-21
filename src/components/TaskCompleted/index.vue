<template>
    <div class="task-completed" v-if="props.visible">
        <div class="task-completed-content">
            <div class="task-completed-content-title">
                {{ title }}
            </div>
            <div class="task-completed-content-icon">
                <SvgIcon prefix="icon" name="complete" />
            </div>
            <div class="task-completed-content-text">
                <div class="task-completed-content-text-title" @click="onCancel">
                    {{ cancelText }}
                </div>
                <div class="task-completed-content-text-desc" @click="onContinue">
                    {{ continueText }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue'
const props = defineProps<{
    visible: boolean,
    title: string,
    cancelText: string,
    continueText: string,
    onCancel: () => void,
    onContinue: () => void,
}>()
</script>

<style scoped>
.task-completed {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.task-completed-content {
    width: 282px;
    height: 184px;
    background-color: #FFFFFF;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.task-completed-content-title {
    color: #000000;
    font-family: Inter;
    font-size: 20px;
    font-weight: 500;
    line-height: 24.2px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

}

.task-completed-content-icon {
    width: 60px;
    height: 60px;
    color: #1AE28E;
}

.task-completed-content-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 80px;
}

.task-completed-content-text-title {
    font-family: Inter;
    font-size: 16px;
    font-weight: 400;
    line-height: 19.36px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #666666;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    user-select: none;
}

.task-completed-content-text-desc {
    font-family: Inter;
    font-size: 16px;
    font-weight: 400;
    line-height: 19.36px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #1AE28E;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    user-select: none;
}
</style>
