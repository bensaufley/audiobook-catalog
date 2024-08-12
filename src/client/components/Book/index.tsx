import { useComputed, useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';

import useEvent from '~client/hooks/useEvent';
import { rawBooks, selectedBookId, setBookRead } from '~client/signals/books';
import { currentUserId } from '~client/signals/User';

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

  const handleRead = useEvent(async (e: JSX.TargetedEvent<HTMLInputElement>) => {
    e.preventDefault();
    changingRead.value = true;
    const { checked } = e.currentTarget;
    checkRef.current!.checked = !checked;
    if ((await setBookRead(bookId, checked)) && checkRef.current) checkRef.current.checked = checked;
    changingRead.value = false;
  });

  return (
    <div class={styles.container}>
      <div
        role="button"
        tabindex={0}
        class={styles.book}
        onClick={onClick}
        style={{ '--cover': `url('/books/${bookId}/cover')` }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onClick(e);
          }
        }}
      >
        {currentUserId.value && (
          <input disabled={changingRead} ref={checkRef} type="checkbox" onChange={handleRead} checked={read.value} />
        )}
      </div>
    </div>
  );
};

export default Book;
