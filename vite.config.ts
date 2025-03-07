import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'./', // 指定当前项目的路径信息
  build:{
    outDir:"dist-react" // react build 完成的文件地址
  },
  server:{ // 自定义 服务器的端口信息，也就是 react 运行时候的端口信息
    port:5123,
    strictPort:true // 严格启用端口信息
  }
})
