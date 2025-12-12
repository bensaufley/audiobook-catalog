/* eslint-disable import/no-extraneous-dependencies */
import { register } from 'tsx/esm/api';

const api = register({
  namespace: 'server',
  tsconfig: import.meta.resolve('./tsconfig.json', import.meta.url),
});

const init = await api.import('./init.ts', import.meta.url);

const srv = await init();

export default srv.server;
