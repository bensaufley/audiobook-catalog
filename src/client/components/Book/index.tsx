import type { FunctionComponent, JSX } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import BookModal from '~client/components/BookModal';
import { useModal } from '~client/contexts/Modal';
import { useOptions } from '~client/contexts/Options';
import { useUser } from '~client/contexts/User';
import type { AudiobookJSON } from '~db/models/Audiobook';
import type { UserAudiobookJSON } from '~db/models/UserAudiobook';

import styles from '~client/components/Book/styles.module.css';

interface Props {
  book: AudiobookJSON;
}

const stopProp: JSX.GenericEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};

const Book: FunctionComponent<Props> = ({ book }) => {
  const { setContent } = useModal();
  const { updateBook } = useOptions();

  const read = book.UserAudiobooks?.some(({ read: r }) => r);

  const { user } = useUser();

  const onClick = useCallback(
    (e: Event) => {
      e.preventDefault();
      setContent(<BookModal book={book} />);
    },
    [book],
  );

  const [loading, setLoading] = useState(false);

  const handleRead = useCallback(
    async ({ currentTarget: { checked } }: JSX.TargetedEvent<HTMLInputElement>) => {
      setLoading(true);

      try {
        const path = checked ? 'read' : 'unread';
        await fetch(`/users/books/${book.id}/${path}`, {
          method: 'POST',
          headers: { 'x-audiobook-catalog-user': user!.id },
        });

        const ua = book.UserAudiobooks?.some(({ UserId }) => UserId === user!.id);
        const UserAudiobooks: UserAudiobookJSON[] = ua
          ? book.UserAudiobooks!.map((x) => (x.UserId === user!.id ? { ...x, read: checked } : x))
          : [
              {
                read: checked,
                UserId: user!.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                AudiobookId: book.id,
              },
            ];
        updateBook({ ...book, UserAudiobooks });
      } catch {
        /* noop */
      }

      setLoading(false);
    },
    [setLoading],
  );

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
        {user && <input disabled={loading} type="checkbox" onChange={handleRead} onClick={stopProp} checked={read} />}
      </div>
    </div>
  );
};

export default Book;
