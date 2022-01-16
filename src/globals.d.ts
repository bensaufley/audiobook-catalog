declare namespace NodeJS {
  export interface ProcessEnv {
    APP_ENV: 'development' | 'test' | 'prod';
    DB_DIR: string;
    DB_NAME: string;
    LOG_LEVEL?: 'trace' | 'debug' | 'info' | 'warn' | 'error';
    POLL_PERIOD?: string;
  }
}

declare module '*.module.css' {
  const mod: Record<string, string>;
  export default mod;
}
