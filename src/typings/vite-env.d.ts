/// <reference types="vite/client" />
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const zhCn: {
    name: string
    el: Record<string, string>
  }
  export default zhCn
}
declare module 'spline-vue/v3' {
import { DefineComponent } from 'vue'
const SplineComponent: DefineComponent<{
  scene: string
}>
export default SplineComponent
}
declare const __APP_VERSION__: string
declare const __APP_ENV__: string
declare const __APP_TITLE__: string
