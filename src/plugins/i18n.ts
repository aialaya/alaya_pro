import { createI18n } from 'vue-i18n'
import enUS from '@/locales/en-US'
import zhCN from '@/locales/zh-CN'
import zhTW from '@/locales/zh-TW'
import koKR from '@/locales/ko-KR'
import jaJP from '@/locales/ja-JP'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'ko-KR': koKR,
    'ja-JP': jaJP
  }
})

export default i18n 