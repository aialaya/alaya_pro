<template>
    <svg aria-hidden="true" class="svg-icon">
      <use :xlink:href="symbolId"/>
    </svg>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  const props = defineProps<{
      prefix: string
      name: string
  }>()
  const symbolId = computed(() => `#${props.prefix}-${props.name}`)
  </script>
  
  <style scoped>
  .svg-icon {
      width: 100%;
      height: 100%;
      fill: currentColor;
      stroke: currentColor;
  }
  </style>