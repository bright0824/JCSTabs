/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_FIREBASE_APPCHECK_DEBUG_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
