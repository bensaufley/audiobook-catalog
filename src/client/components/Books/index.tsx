import { clsx } from 'clsx';
import type { FunctionComponent } from 'preact';

import Book from '~client/components/Book';
import BookModal from '~client/components/BookModal';
import { selectedBookId } from '~client/signals/books';
import { books } from '~client/signals/books/filters';
import { page, pages, showUpNext, sizeColumns } from '~client/signals/options';
import { clamp } from '~shared/utilities';

import useQuickNav from '../../hooks/useQuickNav';
import Pagination from '../Pagination';

import styles from '~client/components/Books/styles.module.css';

const Books: FunctionComponent = () => {
  const ref = useQuickNav<HTMLDivElement>(!selectedBookId.value, (delta: number) => {
    const newVal = clamp(0, page.peek() + delta, pages.peek());
    if (page.peek() !== newVal) page.value = newVal;
  });

  if (!books.value) {
    return <h2 class="d-flex justify-content-center mx-auto my-4">Loading&hellip;</h2>;
  }

  return (
    <div>
      <div class={clsx(styles.container, 'd-grid', 'gap-2', 'm-2')} style={{ '--cols': sizeColumns.value }} ref={ref}>
        {books.value.map((book) => (
          <Book bookId={book.id} key={book.id} />
        ))}
      </div>
      <BookModal key={selectedBookId.value} />
      {!showUpNext.value && <Pagination />}
    </div>
  );
};

export default Books;
