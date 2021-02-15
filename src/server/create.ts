import 'core-js/stable';

import Koa from 'koa';

import dev from '~server/components/dev';
import staticFiles from '~server/components/staticFiles';
import graphqlServer from '~server/graphql/server';

const create = async (): Promise<Koa> => {
  const app = new Koa();

  graphqlServer(app);
  if (!(await dev(app))) {
    staticFiles(app);
  }

  return app;
};

export default create;
