<template>
  <div class="header">
    <img class="logo" src="@/assets/img/aia_logo.png" alt="">
    <div class="language-switch">
      <LangSwitch />
    </div>
  </div>
</template>

<script setup lang="ts">
import LangSwitch from '@/components/LangSwitch/index.vue'
</script>
<style scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 54px;
}
.logo {
    width: 241px; 
    height: 45px; 
    margin-left: 30px;
}
.language-switch {
    margin-right: 30px;
}
</style>