import { fileURLToPath, URL } from 'node:url'
import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'


// https://vite.dev/config/
export default defineConfig(({ mode })=>{
  const env = loadEnv(mode, process.cwd(), '')
  return{
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE),
    },
    base: '/',
    plugins: [
      vue(),
      vueDevTools(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__',
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    publicDir: './public',
    server: {
      port: 3000,
      host: true,
      proxy: env.VITE_PROXY_SWITCH ? {
        [env.VITE_PROXY_PREFIX]: {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_PROXY_PREFIX}`), env.VITE_PROXY_PREFIX),
        },
      } : {},
    },
  }
})
