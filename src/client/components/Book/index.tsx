import { useComputed, useSignal } from '@preact/signals';
import type { JSX } from 'preact';

import useEvent from '~client/hooks/useEvent';
import { selectedBookId, setBookRead } from '~client/signals/Options';
import { user } from '~client/signals/User';
import type { AudiobookJSON } from '~db/models/Audiobook';

import styles from '~client/components/Book/styles.module.css';

interface Props {
  book: AudiobookJSON;
}

const stopProp: JSX.GenericEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};

const Book = ({ book }: Props) => {
  const read = useComputed(() => !!book.UserAudiobooks?.find(({ UserId }) => UserId === user.value?.id)?.read);

  const onClick = useEvent((e: Event) => {
    e.preventDefault();
    selectedBookId.value = book.id;
  });

  const loading = useSignal(false);

  const handleRead = useEvent(async ({ currentTarget: { checked } }: JSX.TargetedEvent<HTMLInputElement>) => {
    loading.value = true;
    try {
      await setBookRead(book.id, checked);
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
