import { IncomingMessage, ServerResponse } from 'http';

import { Book } from '~server/books';
import getClient from '~server/db/getClient';

const render = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const client = await getClient();

    const books = client
      .db()
      .collection<Book>('books')
      .find()
      .sort({ 'author.lastName': 1, 'author.firstName': 1, title: 1 });

    res.writeHead(200);
    res.write(
      '<!DOCTYPE html><head><title>Audiobook Catalog</title></head><body><h1>Audiobook Catalog</h1><ul>'
    );
    books.forEach((book) => {
      const img = Buffer.from(book.cover, 'base64').toString('utf-8');
      res.write(
        `<li><img src="data:image/jpeg;base64,${img}" alt="${book.title}" /><p>${book.title}<br />by ${book.author.firstName} ${book.author.lastName}</p></li>`
      );
    });
    res.write('</ul></body>');
    res.end();

    books.close();
    client.close();
  } catch (err) {
    res.writeHead(500);
    const msg: string = err instanceof Error ? err.message : err.toString();
    res.write(
      `<!DOCTYPE html><html><head><title>Error</title></head><body><h1>500 Error</h1><p>${msg}</p></body></html>`
    );
  }
};

export default render;
