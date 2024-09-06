import { useSignalEffect } from '@preact/signals';
import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import TouchSweep from 'touchsweep';

import Book from '~client/components/Book';
import BookModal from '~client/components/BookModal';
import { books, selectedBookId } from '~client/signals/books';
import { page, pages, showUpNext, sizeColumns } from '~client/signals/options';
import { clamp } from '~shared/utilities';

import Pagination from '../Pagination';

import styles from '~client/components/Books/styles.module.css';

const Books: FunctionComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const touchSweep = useRef<TouchSweep>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const instance = new TouchSweep(el);
    touchSweep.current = instance;

    const movePage = (delta: number) => () => {
      const newVal = clamp(0, page.peek() + delta, pages.peek());
      if (page.peek() !== newVal) page.value = newVal;
    };

    const handleSwipeLeft = movePage(1);
    const handleSwipeRight = movePage(-1);

    el.addEventListener('swipeleft', handleSwipeLeft);
    el.addEventListener('swiperight', handleSwipeRight);

    return () => {
      el.removeEventListener('swipeleft', handleSwipeLeft);
      el.removeEventListener('swiperight', handleSwipeRight);
      instance.unbind();
    };
  }, [books.value]);

  useSignalEffect(() => {
    if (!selectedBookId.value) touchSweep.current?.bind();
    else touchSweep.current?.unbind();
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
