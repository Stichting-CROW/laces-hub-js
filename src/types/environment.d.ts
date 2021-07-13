declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LACES_ENDPOINT_URI: string;
      LACES_APP_ID: string;
      LACES_APP_PWD: string;
    }
  }
}

export {};
