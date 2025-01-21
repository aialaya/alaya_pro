<template>
    <div class="img-view" :style="{width:props.maxWidth+'px',height:heightv+'px'}">
        <img :src="props.url" alt="" srcset="" >
    </div>
</template>

<script setup lang="ts">
import { defineProps,ref } from 'vue'
const props = defineProps<{
    url:string,
    maxWidth:number,
    width:number
    height:number
}>()
const heightv = ref(0)
const aspectRatio = props.height / props.width; 
heightv.value = props.maxWidth * aspectRatio
</script>

<style scoped>
.img-view img {
    width: 100%;
    height: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>