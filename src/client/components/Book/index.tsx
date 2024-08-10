import { useSignal } from '@preact/signals';
import type { JSX } from 'preact';

import useEvent from '~client/hooks/useEvent';
import { selectedBookId, updateBook } from '~client/signals/Options';
import { user } from '~client/signals/User';
import type { AudiobookJSON } from '~db/models/Audiobook';
import type { UserAudiobookJSON } from '~db/models/UserAudiobook';

import styles from '~client/components/Book/styles.module.css';

interface Props {
  book: AudiobookJSON;
}

const stopProp: JSX.GenericEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};

const Book = ({ book }: Props) => {
  const read = book.UserAudiobooks?.some(({ read: r }) => r);

  const onClick = useEvent((e: Event) => {
    e.preventDefault();
    selectedBookId.value = book.id;
  });

  const loading = useSignal(false);

  const handleRead = useEvent(async ({ currentTarget: { checked } }: JSX.TargetedEvent<HTMLInputElement>) => {
    loading.value = true;

    try {
      const path = checked ? 'read' : 'unread';
      await fetch(`/users/books/${book.id}/${path}`, {
        method: 'POST',
        headers: { 'x-audiobook-catalog-user': user.value!.id },
      });

      const ua = book.UserAudiobooks?.some(({ UserId }) => UserId === user.value!.id);
      const UserAudiobooks: UserAudiobookJSON[] = ua
        ? book.UserAudiobooks!.map((x) => (x.UserId === user.value!.id ? { ...x, read: checked } : x))
        : [
            {
              read: checked,
              UserId: user.value!.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              AudiobookId: book.id,
            },
          ];
      updateBook({ ...book, UserAudiobooks });
    } catch {
      /* noop */
    }

    loading.value = false;
  });

  return (
    <div class={styles.container}>
      <div
        role="button"
        tabindex={0}
        class={styles.book}
        onClick={onClick}
        style={{ '--cover': `url('/books/${book.id}/cover')` }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onClick(e);
          }
        }}
      >
        {user.value && (
          <input disabled={loading} type="checkbox" onChange={handleRead} onClick={stopProp} checked={read} />
        )}
      </div>
    </div>
  );
};

export default Book;
