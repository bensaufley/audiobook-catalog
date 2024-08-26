import { useComputed, useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';

import useEvent from '~client/hooks/useEvent';
import { rawBooks, selectedBookId, setBookRead } from '~client/signals/books';
import { addBookToUpNext, removeBookFromUpNext, showUpNext } from '~client/signals/Options';
import { currentUserId } from '~client/signals/User';
import MinusCircleFill from '~icons/dash-circle-fill.svg?react';
import GripVertical from '~icons/grip-vertical.svg?react';
import PlusCircleFill from '~icons/plus-circle-fill.svg?react';

import styles from '~client/components/Book/styles.module.css';

interface Props {
  bookId: string;
}

const Book = ({ bookId }: Props) => {
  const checkRef = useRef<HTMLInputElement>(null);
  const book = useComputed(() => rawBooks.value!.find(({ id }) => id === bookId)!);
  const read = useComputed(
    () => !!book.value.UserAudiobooks?.find(({ UserId }) => UserId === currentUserId.value)?.read,
  );

  const onClick = useEvent((e: Event) => {
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
    await addBookToUpNext(bookId);
  });

  const removeFromUpNext = useEvent(async (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    e.preventDefault();
    changingUpNext.value = true;
    await removeBookFromUpNext(bookId);
  });

  return (
    <div class={clsx(styles.container, showUpNext.value && styles.grabbable)} draggable={showUpNext}>
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
        {currentUserId.value && (
          <>
            <GripVertical className={styles.grip} />
            {book.value.UpNexts?.length ? (
              <button
                class={clsx(styles.upNext, styles.remove)}
                disabled={changingUpNext}
                type="button"
                aria-label="Remove from Up Next"
                title="Remove from Up Next"
                onClick={removeFromUpNext}
              >
                <MinusCircleFill />
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
                <PlusCircleFill />
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
