/* eslint-disable unicorn/prevent-abbreviations */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HIVE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
