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
    NODE_ENV: 'development' | 'production';
    ROOT_DIR: string;
  }
}
