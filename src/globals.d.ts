/* eslint-disable import/no-duplicates */

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const document: DocumentNode;
  export default document;
}

declare module '*.graphqls' {
  import { DocumentNode } from 'graphql';

  const document: DocumentNode;
  export default document;
}

declare namespace NodeJS {
  export interface ProcessEnv {
    IMPORTS_PATH?: string;
    NODE_ENV: 'development' | 'production';
    POLL_PERIOD?: string;
    ROOT_DIR: string;
  }
}
