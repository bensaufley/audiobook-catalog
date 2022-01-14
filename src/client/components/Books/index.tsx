import { FunctionComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Book from '~client/components/Book';
import type Audiobook from '~db/models/Audiobook';

import styles from '~client/components/Books/styles.module.css';

const Books: FunctionComponent = () => {
  const [error, setError] = useState<string>();
  const [books, setBooks] = useState<Audiobook<unknown>[]>();

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/books');
        const bks = await resp.json();
        setBooks(bks);
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, []);

  if (!books) {
    return <h2>Loading&hellip;</h2>;
  }

  return (
    <div class={styles.container}>
      {books?.map((book) => (
        <Book book={book} />
      ))}
    </div>
  );
};

export default Books;
