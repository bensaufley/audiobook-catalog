declare namespace NodeJS {
  export interface ProcessEnv {
    APP_ENV: 'development' | 'test' | 'prod';
    AUDIOBOOKS_PATH?: string;
    AUTORUN?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_PATH: string;
    POLL_PERIOD?: string;
  }
}
