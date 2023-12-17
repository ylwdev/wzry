import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";
// import legacy from "@vitejs/plugin-legacy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const getViteEnv = (target: string): any => env[target];

  return {
    base: "./",
    plugins: [
      vue(),
      visualizer({
        filename: "visualizer.html",
      }),
      // legacy({
      //   targets: [">0.1%", "last 2 version", "not dead"],
      // }),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "王者荣耀图鉴",
          short_name: "王者图鉴",
          theme_color: "#000",
          start_url: "/king-honor",
          display: "standalone",
          background_color: "#000",
          icons: [
            {
              src: "wzry.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "./src/styles/index.less";',
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 9527,
      proxy: {
        "/api": {
          target: "https://192.168.2.6:5500",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      },
    },
    // * 打包去除 console.log && debugger
    esbuild: {
      pure:
        getViteEnv("VITE_CLEAR_LOG") === "1"
          ? ["console.log", "console.warn", "console.error", "debugger"]
          : [],
    },
    build: {
      minify: false,
      chunkSizeWarningLimit: 2000, // 超过2000kb警告
      reportCompressedSize: false, // 禁用 gzip 压缩大小报告，可略微减少打包时间
      cssTarget: "chrome61",
      rollupOptions: {
        output: {
          manualChunks: {
            _vue: ["vue", "vue-router", "pinia", "mitt"],
            _util: ["dayjs", "lodash"],
            _wangeditor: ["@wangeditor/editor-for-vue"],
            _i18n: ["vue-i18n"],
            _axios: ["axios"],
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  };
});
