<template>
  <div class="lang-switch">
    <el-popover placement="top"   :visible="isOpen"  trigger="click" :show-arrow="false"
      popper-style="--el-bg-color-overlay: rgba(0, 0, 0, .8);margin-top:30px;border-radius:10px;min-height:100px;">
      <div class="lang_popover">
        <div class="lang_popover_item" v-for="lang in languages" :key="lang.value" :command="lang.value" @click="handleCommand(lang.value)">
          {{ lang.label }}
        </div>
      </div>
      <template #reference>
        <div class="el-dropdown-link" @click="togglePopover">
          <SvgIcon prefix="icon" name="language" class="lang-icon" />
          {{ languages.find(lang => lang.value === currentLocale)?.label }}
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'
import { events } from '@/utils'
import SvgIcon from '@/components/SvgIcon/index.vue'

const userStore = useUserStore()
const isOpen = ref(false)

const languages = [
  { label: 'English', value: 'en-US' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: '한국어', value: 'ko-KR' },
  { label: '日本語', value: 'ja-JP' },
  { label: '简体中文', value: 'zh-CN' }
]

const { locale } = useI18n()
const currentLocale = ref(userStore.language)

const togglePopover = () => {
  isOpen.value = !isOpen.value
}

const handleCommand = (command: string) => {
  togglePopover()
  currentLocale.value = command
  locale.value = command
  userStore.setLanguage(command)
  events.emit('languageChange', command)
}


watch(currentLocale, (newLocale) => {
  locale.value = newLocale
  userStore.setLanguage(newLocale)
  events.emit('languageChange', newLocale)
})
</script>

<style scoped>
.lang-switch {
  display: inline-block;
}

.lang-icon {
  width: 21px;
  height: 21px;
}

.el-dropdown-link {
  width: 110px;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
  font-family: Inter;
  font-size: 20px;
  font-weight: 400;
  line-height: 24.2px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #BBBBBB;
}
.el-dropdown-link:hover{
  color: rgba(26, 226, 142, 1);
}
.lang_popover{
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lang_popover_item {
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 19.36px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: rgba(255, 255, 255, 1);
}
.lang_popover_item:hover{
  color: rgba(26, 226, 142, 1);
}
</style>
