<script setup lang="ts">
import {useUserStore} from '@/stores'
import { getCurrentLanguage } from '@/plugins/element'
import { ref, watch } from 'vue'
import {events} from '@/utils'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const { locale } = useI18n()
const localeData = ref(getCurrentLanguage(userStore.language))


watch(() => userStore.language, (newLang) => {
  locale.value = newLang
  localeData.value = getCurrentLanguage(newLang)
})

events.on('languageChange', (language: any) => {
  localeData.value = getCurrentLanguage(language)
})
</script>

<template>
  <el-config-provider :locale="localeData" :button="{ autoInsertSpace: true }">
    <router-view />
  </el-config-provider>
</template>

<style scoped>

</style>
