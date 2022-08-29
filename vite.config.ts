// noinspection JSUnusedGlobalSymbols

import { fileURLToPath, URL } from "node:url";

import path from "path";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
import { defineConfig } from "vite";
// import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteCompression()], // , visualizer()
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
    watch: {
      // https://rollupjs.org/guide/en/#watch-options
    },
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
