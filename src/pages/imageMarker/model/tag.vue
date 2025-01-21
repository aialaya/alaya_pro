<template>
    <div class="tag_container" v-if="props.show">
        <div class="tag_model_box" :style="{top:`${props.position.top}px`,left:`${props.position.left}px`}">
            <div class="tag_item" v-for="item in props.tagList" :key="item.name" @click="handleClick(item.name)">
                <div class="tag_item_content">
                    <div class="tag_item_content_text">{{item.name}}</div>
                </div>
            </div>
        </div>
    </div>
    </template>
    
    <script setup lang="ts">
    import { defineEmits } from 'vue'
    const emit = defineEmits(['handleClick'])
    const props = defineProps<{
        tagList: Array<Api.MarkerInfo.Tag>
        show: boolean
        position: {
            top: number
            left: number
        }
    }>()
    const handleClick = (item:string)=>{
        emit('handleClick',item)
    }
    </script>
    
    <style scoped>
    .tag_container {
        z-index: 1000;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .tag_model_box {
        position: absolute;
        display: inline-block;
        background-color: #FFFFFF;
        padding:9px 12px;
        border-radius: 10px;
        gap: 14px;
    
    }
    .tag_item {
        padding: 9px 16px;
        color: #666666;
        border: 1px solid #999999;
        border-radius: 10px;
        font-family: Inter;
        font-size: 14px;
        font-weight: 400;
        line-height: 16.94px;
        text-align: center;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        cursor: pointer;
        margin-bottom: 14px;
    }
    </style>