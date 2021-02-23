import Koa from 'koa';
import koaMount from 'koa-mount';
import koaSend from 'koa-send';
import koaStatic from 'koa-static';
import { resolve } from 'path';

const staticFiles = async (app: Koa) => {
  app.use(
    koaMount(
      '/static',
      koaStatic(resolve(process.env.ROOT_DIR, '.build/client'), {
        gzip: true,
      }),
    ),
  );
};

export const downloads = (app: Koa) => {
  app.use(koaMount('/downloads', koaStatic(process.env.STORAGE_PATH, { gzip: true })));
};

export const index = (app: Koa) => {
  app.use(async (ctx) => {
    await koaSend(ctx, resolve(process.env.ROOT_DIR, '.build/client/index.html'));
  });
};

export default staticFiles;
