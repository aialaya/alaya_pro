import { createApp } from 'vue'
import 'reset-css'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import { InitWasm } from '@/utils'
import router from '@/router'
import { setupElementPlus } from '@/plugins/element'
import i18n from './plugins/i18n'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'virtual:svg-icons-register'

const app = createApp(App)

const setupApp = async () => {
  app.use(i18n)
  app.use(router)
  app.use(createPinia())
  setupElementPlus(app)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(ElementPlus)
  await InitWasm().then(() => {
    app.mount('#app');
  });
}

setupApp()

