import 'core-js/stable';

import Koa from 'koa';

import covers from '~server/components/covers';
import dev from '~server/components/dev';
import staticFiles, { downloads, index } from '~server/components/staticFiles';
import graphqlServer from '~server/graphql/server';

const create = async (): Promise<Koa> => {
  const app = new Koa();

  graphqlServer(app);
  covers(app);
  downloads(app);
  if (!(await dev(app))) {
    await staticFiles(app);
  }
  index(app);

  return app;
};

export default create;
