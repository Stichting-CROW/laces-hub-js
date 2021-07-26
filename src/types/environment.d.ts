declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LACES_ENDPOINT_URI: string;
      LACES_APP_ID: string;
      LACES_APP_PWD: string;
      npm_package_name: string;
      npm_package_homepage: string;
      npm_package_version: string;
      npm_package_author: string;
    }
  }
}

export {};
