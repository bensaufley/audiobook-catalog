import { h, Fragment, FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import type Audiobook from '~db/models/Audiobook';

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
};

const Books: FunctionComponent = () => {
  const [error, setError] = useState<string>();
  const [books, setBooks] = useState<Audiobook<unknown>[]>();

  useEffect(() => {
    (async () => {
      try {
        const bks = await (await fetch('/books')).json();
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
    <>
      {books?.map((book) => (
        <>
          <img src={`/books/${book.id}/cover`} alt={book.title} width={300} />
          <p>
            <i>{book.title}</i> by {book.Authors?.map(({ firstName, lastName }) => `${firstName} ${lastName}`)}
            {book.duration && <> ({formatDuration(book.duration)})</>}
          </p>
          <p>
            <a href={`/books/${book.id}/download`}>Download</a>
            <a href={`bookplayer://download?url="${location.protocol}//${location.host}/books/${book.id}/download"`}>
              Bookplayer
            </a>
          </p>
        </>
      ))}
    </>
  );
};

export default Books;
