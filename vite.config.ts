import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Element-Plus自动导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // // 反向代理配置 - 解决跨域问题
  server:{
    host: true,
    port: 6628,
    cors: true,
    proxy: {
      '/api': {
       target: "http://124.70.33.143:8080/",
       changeOrigin: true,
       rewrite: path => {
        //  console.log('path :>> ', path, path.replace(/^\/api/, ''))
        return path.replace(/^\/api/, '')
       }
      }
    }
  }
})
