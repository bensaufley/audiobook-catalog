import { Fragment, FunctionComponent, h } from 'preact';

import Book from '~client/components/Book';
import BookModal from '~client/components/BookModal';
import { useOptions, useSizeColumns } from '~client/contexts/Options';

import styles from '~client/components/Books/styles.module.css';

const Books: FunctionComponent = () => {
  const { books, error, selectedBook, selectBook, unselectBook } = useOptions();
  const columns = useSizeColumns();

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
        {books.map((book) => (
          <Book book={book} />
        ))}
      </div>
      {selectedBook && <BookModal book={selectedBook} />}
    </>
  );
};

export default Books;
