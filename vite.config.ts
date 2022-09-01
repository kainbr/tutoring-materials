// noinspection JSUnusedGlobalSymbols

import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import vue from "@vitejs/plugin-vue";

import type { PluginOption } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), <PluginOption>visualizer()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
    "process.env": {},
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "TutoringMaterials",
      fileName: `tutoring-materials`,
    },
    minify: "esbuild",
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
