import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import VueRouter from "unplugin-vue-router/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dataFetching: true,
      routesFolder: "src/pages",
      routeBlockLang: "json5",
      importMode: "async",
    }),
    vue({
      reactivityTransform: true,
    }),
    vuetify(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue\??/, // .vue
        /\.mdx?$/, // .md, .mdx
      ],

      imports: [
        "vue",
        VueRouterAutoImports,
        {
          vuetify: ["useTheme", "useDisplay"],
          "firebase/auth": ["GoogleAuthProvider", "signInWithPopup"],
          "firebase/firestore": [
            "doc",
            "collection",
            "onSnapshot",
            "arrayRemove",
            "addDoc",
            "updateDoc",
            "Timestamp",
            "arrayUnion",
          ],
          "firebase/functions": ["httpsCallable"],
          "@/firebase": ["auth", "db", "functions"],
        },
      ],

      eslintrc: {
        enabled: true,
      },
    }),
    Components(),
    VitePWA({
      injectRegister: "inline",
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "JCS Tab Tracker",
        short_name: "JCS Tabs",
        start_url: ".",
        display: "standalone",
        description: "Helps users keep track of their tab",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/www\.googleapis.com\/plus\/v1\/people\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-profile-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/(.*\.googleusercontent\.com\/.*)/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-profile-images",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30, // <== 1 month
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
  },
  esbuild: {
    drop: ["console", "debugger"],
    legalComments: "none",
    format: "esm",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: [
            "firebase/auth",
            "firebase/firestore",
            "firebase/functions",
          ],
          vue: ["vue", "vue-router"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      utils: fileURLToPath(new URL("./src/utils", import.meta.url)),
      types: fileURLToPath(new URL("./src/types", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Referrer-Policy": "no-referrer",
    },
  },
});
