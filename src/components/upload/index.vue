<template>
  <div class="upload-container">
     <input type="file" @change="handleFileChange" />
     <div class="upload-content" v-if="loading">
         <el-icon><Loading /></el-icon>
     </div>
     <div v-else>
         <div class="upload-content" v-if="!url">
             <el-icon><Plus /></el-icon>
         </div>
     <div class="upload-content" v-else>
         <img :src="url" alt="upload" />
     </div>
    </div>
  </div>
 </template>
 
 <script setup lang="ts">
 import { uploadFileApi } from '@/api/upload'
 import { ref, watch } from 'vue'
 const url = ref('')
 const loading = ref(false)
 const width = ref('100px')
 const height = ref('100px')
 const props = defineProps<{
   onSuccess: (res: Api.Upload.Resp) => void
   width: Number,
   height: Number
 }>()
 watch(() => props.width, (newVal) => {
   width.value = `${newVal}px`
 })
 watch(() => props.height, (newVal) => {
   height.value = `${newVal}px`
 })
 
 const handleFileChange = async (e: Event) => {
     loading.value = true
   const file = (e.target as HTMLInputElement).files?.[0]
   if (file) {
     try {
         const res = await uploadFileApi({file});
         url.value = res.data!.url;
         props.onSuccess(res.data!);
         loading.value = false;
     } catch (error) {
         console.log(error)
     } finally {
         loading.value = false;
         (e.target as HTMLInputElement).value = '';
     }
   }
 }
 </script>
 
 <style scoped>
 .upload-container {
   width: v-bind('width');
   height: v-bind('height');
   border: 1px solid #ccc;
   border-radius: 4px;
   cursor: pointer;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
 }
 
 .upload-container:hover {
   border-color: #000;
 }
 .upload-content {
     width: 100%;
     height: 100%;
     display: flex;
     justify-content: center;
     align-items: center;
     position: absolute;
     top: 0;
     left: 0;
 }
 img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     border-radius: 4px;
 }
 input {
     display: block;
     width: 100%;
     height: 100%;
     cursor: pointer;
     opacity: 0;
     position: absolute;
     top: 0;
     left: 0;
     z-index: 100;
 }
 
 </style>
 