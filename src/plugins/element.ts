import { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import enUS from 'element-plus/dist/locale/en.mjs'
import koKR from 'element-plus/dist/locale/ko.mjs'
import jaJP from 'element-plus/dist/locale/ja.mjs'
import zhTW from 'element-plus/dist/locale/zh-tw.mjs'

const localeMap = {
  'zh-CN': zhCn,
  'en-US': enUS,
  'ko-KR': koKR,
  'ja-JP': jaJP,
  'zh-TW': zhTW
}

export function setupElementPlus(app: App) {
  const savedLanguage = localStorage.getItem('language') || 'en-US'
  app.use(ElementPlus, {
    locale: localeMap[savedLanguage as keyof typeof localeMap],
  })
}


export function getCurrentLanguage(language: string) {
  return localeMap[language as keyof typeof localeMap]
}