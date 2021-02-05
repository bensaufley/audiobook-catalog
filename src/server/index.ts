import { createServer } from 'http';

import getClient from '~server/db/getClient';

import render from './render';

const server = createServer((req, res) => {
  const { pathname } = new URL(`http://example.com${req.url!}`);
  switch (pathname) {
    case '/': {
      render(req, res);
      break;
    }
    default: {
      res.writeHead(404);
      res.write(
        '<!DOCTYPE html><html><head><title>Audiobook Catalog: Not Found</title></head><body><h1>Audiobook Catalog</h1><p>404 Not Found</p></body></html>'
      );
    }
  }
  res.writeHead(200);
});

getClient()
  .then((client) => {
    client.close();
  })
  .then(() => {
    const port = process.env.PORT || '8080';
    console.log(`Listening on port ${port}`);
    server.listen(port);
  })
  .catch((err) => {
    console.error('Error starting server:', err);
  });
