import type Koa from 'koa';
import { Db, ObjectID } from 'mongodb';

import getCollection from '~server/components/db/getCollection';

const covers = (app: Koa, db: Db) => {
  app.use(async (ctx, next) => {
    const {
      request: { path },
    } = ctx;
    console.log('inside covers', path);
    if (!path.startsWith('/cover/')) {
      await next();
      return;
    }

    if (!/^\/cover\/[^/]+$/.test(path)) {
      ctx.response.status = 404;
      return;
    }

    try {
      const objID = path.replace(/^\/cover\//, '');

      const audiobooks = await getCollection(db, 'audiobooks');
      const audiobook = await audiobooks.findOne({ _id: { $eq: new ObjectID(objID) } });
      if (!audiobook?.cover) {
        ctx.response.status = 404;
        return;
      }

      console.log('cover data type', typeof audiobook.cover.data);
      console.log(audiobook.cover);

      ctx.set('Content-Type', audiobook.cover.format);
      ctx.body = audiobook.cover.data.read(0, audiobook.cover.data.length());
    } catch (err) {
      console.error('error looking up cover at path', path, '-', err);
      ctx.response.status = 404;
    }
  });
};

export default covers;
