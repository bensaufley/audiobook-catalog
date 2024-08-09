import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

import Book from '~client/components/Book';
import BookModal from '~client/components/BookModal';
import { books, error, sizeColumns } from '~client/signals/Options';

import Pagination from '../Pagination';

import styles from '~client/components/Books/styles.module.css';

const Books: FunctionComponent = () => {
  if (error.value) {
    return (
      <div class="d-flex justify-content-center mx-auto my-4">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!books.value) {
    return <h2 class="d-flex justify-content-center mx-auto my-4">Loading&hellip;</h2>;
  }

  return (
    <>
      <div class={clsx(styles.container, 'm-2')} style={{ '--cols': sizeColumns.value }}>
        {books.value.map((book) => (
          <Book book={book} key={book.id} />
        ))}
      </div>
      <BookModal />
      <Pagination />
    </>
  );
};

export default Books;
