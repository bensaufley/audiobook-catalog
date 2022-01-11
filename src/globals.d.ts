declare namespace NodeJS {
  export interface ProcessEnv {
    APP_ENV: 'development' | 'test' | 'prod';
    AUTORUN?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_PATH: string;
  }
}
