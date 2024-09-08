import { useComputed, useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';
import { useMemo, useRef } from 'preact/hooks';

import useEvent from '~client/hooks/useEvent';
import { readBooks, selectedBookId, upNext } from '~client/signals/books';
import {
  addToUpNext as upNextBook,
  removeFromUpNext as unUpNextBook,
  setBookRead,
} from '~client/signals/books/helpers';
import { currentUserId } from '~client/signals/user';
import BookmarkDashFill from '~icons/bookmark-dash-fill.svg?react';
import BookmarkPlusFill from '~icons/bookmark-plus-fill.svg?react';

import Base, { type Props } from './Base';

import styles from './styles.module.css';

const StandardBook = ({ bookId }: Props) => {
  const checkRef = useRef<HTMLInputElement>(null);

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

  const isUpNext = useMemo(
    () => upNext.value.some(({ AudiobookId }) => AudiobookId === bookId),
    [upNext.value, bookId],
  );

  return (
    <Base bookId={bookId} onClick={onClick}>
      {currentUserId.value && (
        <>
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
    </Base>
  );
};

export default StandardBook;
