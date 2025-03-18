/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_PROPERTY_ID: string
  readonly VITE_GA_CLIENT_EMAIL: string
  readonly VITE_GA_PRIVATE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
