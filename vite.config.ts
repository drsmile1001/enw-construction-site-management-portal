import vue from "@vitejs/plugin-vue"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import Components from "unplugin-vue-components/vite"
import AutoImport from "unplugin-auto-import/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"
import path from "path"
import UnoCSS from "unocss/vite"
import svgLoader from "vite-svg-loader"
import { dynamicBase } from "vite-plugin-dynamic-base"

export default defineConfig({
  server: {
    port: 5804,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  plugins: [
    dynamicBase({
      transformIndexHtml: true,
    }),
    UnoCSS(),
    vue(),
    svgLoader({
      defaultImport: "url",
    }),
    AutoImport({
      dts: "src/types/auto-import.d.ts",
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
    }),
    Components({
      dirs: ["src/components"],
      deep: true,
      dts: "src/types/components.d.ts",
      resolvers: [NaiveUiResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
