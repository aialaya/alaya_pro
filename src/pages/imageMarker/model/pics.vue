<template>
    <div class="image-marker-left">
        <div class="image-marker-left-header">
            <div class="image-marker-left-header-title">
                {{ $t('imageMarker.title') }}
            </div>
        </div>
        <div class="image-marker-left-content">
            <div v-for="(k, i) in sceneStore.scenes" :key="i"
                :class="{
                  'activity': sceneStore.currentIndex === i,
                  'image-marker-left-content-item': sceneStore.currentIndex !== i
                }"
                @click="handleClick(i)">
                <ImgView :url="k.result || k.imgUrl" :maxWidth="201" :width="k.imgWidth" :height="k.imgHeight" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSceneStore } from '@/stores'
import ImgView from '@/components/ImgView/index.vue'
const sceneStore = useSceneStore()
const handleClick = (_index: number) => {
}
</script>

<style scoped>
.image-marker-left {
    min-height: 100vh;
    width: 267px;
    background-color: rgba(232, 232, 232, 1);
    display: flex;
    flex-direction: column;
}

.image-marker-left-content {
    display: flex;
    flex-wrap: wrap;
    padding: 0px 33px;
    gap: 12px;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    margin-top: 3px;
    padding-bottom: 88px;
    align-content: flex-start;
}

.image-marker-left-content::-webkit-scrollbar {
    display: none;
}

.image-marker-left-header {
    height: 88px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: Inter;
    font-size: 24px;
    font-weight: 500;
    line-height: 29.05px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: rgba(51, 51, 51, 1);
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
    user-select: none;
}

.image-marker-left-header-title::first-letter {
    color: #1AE28E;
}

.decorate {
    color: rgba(26, 226, 142, 1);
}

.activity {
    border: 2px solid rgba(35, 223, 141, 1);
}

.image-marker-left-content-item {
    border: 2px solid rgba(255, 255, 255, 0.1);
}
</style>