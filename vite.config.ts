import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import vuetify from "vite-plugin-vuetify";
import AutoImport from "unplugin-auto-import/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Referrer-Policy": "no-referrer",
    },
  },
  plugins: [
    VueRouter({
      routesFolder: "src/pages",
      dataFetching: true,
      routeBlockLang: "json5",
      importMode: "async",
    }),
    vue(),
    mkcert(),
    vuetify({
      autoImport: true,
    }),
    AutoImport({
      eslintrc: {
        enabled: true,
      },
      imports: [
        "vue",
        VueRouterAutoImports,
        "@vueuse/core",
        "pinia",
        {
          vuefire: [
            "getCurrentUser",
            "useAppCheck",
            "useAppCheckToken",
            "useCollection",
            "useCurrentUser",
            "useDocument",
            "useFirebaseApp",
            "useFirebaseAuth",
            "useFirestore",
          ],
          "firebase/firestore": [
            "doc",
            "collection",
            "Timestamp",
            "addDoc",
            "updateDoc",
            "arrayUnion",
            "arrayRemove",
          ],
        },
      ],
    }),
    Components({
      dts: true,
    }),
    VitePWA({
      injectRegister: "inline",
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      devOptions: {
        enabled: false,
      },
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
    __VUE_OPTIONS_API__: true,
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
      "~utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
});
