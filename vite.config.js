import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const host = process.env.TAURI_DEV_HOST

// https://vite.dev/config/
export default defineConfig(async () => ({
  base:
    process.env.TAURI_ENV_PLATFORM || process.env.TAURI_PLATFORM
      ? "/"
      : "/zmux/",
  plugins: [vue()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    // 👇 修改这里：如果是移动端开发，强制为 true（即 0.0.0.0），否则用原逻辑
    host: true,

    // 👇 修改这里：确保 HMR（热更新）在移动端或模拟器上也能连通
    hmr: {
      protocol: "ws",
      host: host || "0.0.0.0",
      port: 1421,
    },
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    proxy: {
      "/api/proxy/netease": {
        target: "https://music.163.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/netease/, ""),
        headers: {
          Referer: "https://music.163.com/",
        },
      },
    },
  },
}))
