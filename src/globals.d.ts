/* eslint-disable import/no-extraneous-dependencies */
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

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.svg?react' {
  import type { FunctionComponent, JSX } from 'preact';

  const Svg: FunctionComponent<JSX.HTMLAttributes<SVGSVGElement>>;
  export default Svg;
}
