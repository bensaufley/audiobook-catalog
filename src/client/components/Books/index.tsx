import { FunctionComponent, Fragment, h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

import Book from '~client/components/Book';
import type Audiobook from '~db/models/Audiobook';
import styles from '~client/components/Books/styles.module.css';
import BookModal from '~client/components/BookModal';
import { useOptions, useSizeColumns } from '~client/components/contexts/Options';
import { jarowinkler } from 'wuzzy';

const threshold = 0.5;

const Books: FunctionComponent = () => {
  const [error, setError] = useState<string>();
  const [books, setBooks] = useState<Audiobook<unknown>[]>();
  const [selectedBookId, setSelectedBookId] = useState<string>();

  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;

    return books?.find(({ id }) => id === selectedBookId)!;
  }, [books, selectedBookId]);

  const showBook = useCallback(
    (id: string) => {
      setSelectedBookId(id);
    },
    [setSelectedBookId],
  );

  const hideBook = useCallback(() => {
    setSelectedBookId(undefined);
  }, [setSelectedBookId]);

  const columns = useSizeColumns();
  const { filter } = useOptions();

  const filteredBooks = useMemo(() => {
    if (!filter.trim()) return books;

    return books?.filter(
      (book) =>
        jarowinkler(book.title, filter) > threshold ||
        [...(book.Authors || []), ...(book.Narrators || [])].some(
          ({ firstName = '', lastName }) => jarowinkler(`${firstName} ${lastName}`.trim(), filter) > threshold,
        ),
    );
  }, [books, filter]);

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

  if (error) {
    return (
      <>
        <h2>Error</h2>
        <p>{error}</p>
      </>
    );
  }

  if (!books) {
    return <h2>Loading&hellip;</h2>;
  }

  return (
    <>
      <div class={styles.container} style={{ '--cols': columns }}>
        {filteredBooks?.map((book) => (
          <Book book={book} handleClick={showBook} />
        ))}
      </div>
      {selectedBook && <BookModal book={selectedBook} handleHide={hideBook} />}
    </>
  );
};

export default Books;
