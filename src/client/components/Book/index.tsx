import { useComputed, useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';
import { useMemo, useRef } from 'preact/hooks';

import useEvent, { useThrottledEvent } from '~client/hooks/useEvent';
import { rawBooks, readBooks, selectedBookId, stagedUpNextReorder, upNext } from '~client/signals/books';
import {
  addToUpNext as upNextBook,
  removeFromUpNext as unUpNextBook,
  setBookRead,
} from '~client/signals/books/helpers';
import { showUpNext } from '~client/signals/options';
import { currentUserId } from '~client/signals/user';
import BookmarkDashFill from '~icons/bookmark-dash-fill.svg?react';
import BookmarkPlusFill from '~icons/bookmark-plus-fill.svg?react';
import GripVertical from '~icons/grip-vertical.svg?react';

import { draggingBook, draggingElement, dragTarget, persistReorder, reorderBook } from './utils';

import styles from '~client/components/Book/styles.module.css';

interface Props {
  bookId: string;
}

const Book = ({ bookId }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLInputElement>(null);

  const book = useComputed(() => rawBooks.value!.find(({ id }) => id === bookId)!);
  const read = useComputed(() => readBooks.value?.includes(bookId) ?? false);

  const onClick = useEvent((e: JSX.TargetedEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) selectedBookId.value = bookId;
  });

  const changingRead = useSignal(false);
  const changingUpNext = useSignal(false);

  const handleRead = useEvent(async (e: JSX.TargetedEvent<HTMLInputElement>) => {
    e.preventDefault();
    changingRead.value = true;
    const { checked } = e.currentTarget;
    checkRef.current!.checked = !checked;
    if ((await setBookRead(bookId, checked)) && checkRef.current) checkRef.current.checked = checked;
    changingRead.value = false;
  });

  const addToUpNext = useEvent(async (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    e.preventDefault();
    changingUpNext.value = true;
    await upNextBook(bookId);
    changingUpNext.value = false;
  });

  const removeFromUpNext = useEvent(async (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    e.preventDefault();
    changingUpNext.value = true;
    await unUpNextBook(bookId);
    changingUpNext.value = false;
  });

  const handleDragStart = useEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    e.stopImmediatePropagation();
    draggingBook.value = bookId;
    draggingElement.value = ref.current!;
  });

  const handleDrop = useEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    persistReorder();
    draggingBook.value = null;
    draggingElement.value = null;
  });

  const handleDragEnter = useEvent<JSX.DragEventHandler<HTMLDivElement>>(() => {
    dragTarget.value = bookId;
  });

  const handleDragLeave = useEvent<JSX.DragEventHandler<HTMLDivElement>>(() => {
    dragTarget.value = null;
  });

  const handleDragOverFn = useThrottledEvent<JSX.DragEventHandler<HTMLDivElement>>(() => {
    if (!draggingBook.value || draggingBook.value === bookId) return;

    const order = stagedUpNextReorder.value ?? upNext.peek().map(({ AudiobookId: id }) => id);

    const draggingBookIndex = order.indexOf(draggingBook.value);
    const thisBookIndex = order.indexOf(bookId);

    reorderBook(draggingBook.value!, bookId, draggingBookIndex > thisBookIndex);
  });

  const handleDragOver = useEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    if (showUpNext.value && draggingBook.value) handleDragOverFn(e);
  });

  const isUpNext = useMemo(
    () => upNext.value.some(({ AudiobookId }) => AudiobookId === bookId),
    [upNext.value, bookId],
  );

  return (
    <div
      class={clsx(styles.container, showUpNext.value && styles.grabbable)}
      draggable={showUpNext}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={ref}
    >
      <div
        role="button"
        tabindex={0}
        class={styles.book}
        onClick={onClick}
        style={{ '--cover': `url('/api/books/${bookId}/cover')` }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onClick(e);
          }
        }}
      >
        <span>{book.value.title}</span>
        {currentUserId.value && (
          <>
            <GripVertical className={styles.grip} />
            {isUpNext ? (
              <button
                class={clsx(styles.upNext, styles.remove)}
                disabled={changingUpNext}
                type="button"
                aria-label="Remove from Up Next"
                title="Remove from Up Next"
                onClick={removeFromUpNext}
              >
                <BookmarkDashFill />
              </button>
            ) : (
              <button
                class={clsx(styles.upNext, styles.add)}
                disabled={changingUpNext}
                type="button"
                aria-label="Add to Up Next"
                title="Add to Up Next"
                onClick={addToUpNext}
              >
                <BookmarkPlusFill />
              </button>
            )}
            <input disabled={changingRead} ref={checkRef} type="checkbox" onChange={handleRead} checked={read.value} />
          </>
        )}
      </div>
    </div>
  );
};

export default Book;
