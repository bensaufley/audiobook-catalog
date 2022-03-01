import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { jarowinkler } from 'wuzzy';

import Book from '~client/components/Book';
import BookModal from '~client/components/BookModal';
import { useOptions, useSizeColumns } from '~client/components/contexts/Options';
import type Audiobook from '~db/models/Audiobook';

import styles from '~client/components/Books/styles.module.css';

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
    const lowerFilter = filter.trim().toLocaleLowerCase();

    if (!lowerFilter) return books;

    if (!books) return null;

    const exactMatches = books.filter(
      (book) =>
        book.title.toLocaleLowerCase().includes(lowerFilter) ||
        [...(book.Authors || []), ...(book.Narrators || [])].some(({ firstName = '', lastName }) =>
          `${firstName} ${lastName}`.trim().toLocaleLowerCase().includes(lowerFilter),
        ),
    );

    if (exactMatches.length > 0) return exactMatches;

    let fuzzyBooks: Audiobook<unknown>[] = [];

    let threshold = 0.5;
    do {
      fuzzyBooks = books.filter(
        (book) =>
          jarowinkler(book.title, lowerFilter) > threshold ||
          [...(book.Authors || []), ...(book.Narrators || [])].some(
            ({ firstName = '', lastName }) => jarowinkler(`${firstName} ${lastName}`.trim(), lowerFilter) > threshold,
          ),
      );
      threshold += 0.05;
    } while (fuzzyBooks.length > Math.max(2, books.length / 4));

    return fuzzyBooks;
  }, [books, filter]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/books');
        const bks = await resp.json();
        if (!resp.ok) throw bks;
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
