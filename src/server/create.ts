import 'core-js/stable';

import Koa from 'koa';
import { Db } from 'mongodb';

import covers from '~server/components/covers';
import dev from '~server/components/dev';
import staticFiles, { downloads, index } from '~server/components/staticFiles';
import graphqlServer from '~server/graphql/server';

const create = async (db: Db): Promise<Koa> => {
  const app = new Koa();

  graphqlServer(app, db);
  covers(app, db);
  downloads(app);
  if (!(await dev(app))) {
    await staticFiles(app);
  }
  index(app);

  return app;
};

export default create;
