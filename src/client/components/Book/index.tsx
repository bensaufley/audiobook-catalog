import { FunctionComponent, Fragment, h } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

import type { AudiobookJSON } from '~db/models/Audiobook';
import type { UserAudiobookJSON } from '~db/models/UserAudiobook';
import BookModal from '~client/components/BookModal';
import { useModal } from '~client/contexts/Modal';
import { useUser } from '~client/contexts/User';
import styles from '~client/components/Book/styles.module.css';
import { useOptions } from '~client/contexts/Options';

interface Props {
  book: AudiobookJSON;
}

const stopProp: h.JSX.GenericEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};

const Book: FunctionComponent<Props> = ({ book }) => {
  const { setContent } = useModal();
  const { updateBook } = useOptions();

  const read = book.UserAudiobooks?.some(({ read: r }) => r);

  const { user } = useUser();

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setContent(<BookModal book={book} />);
    },
    [book],
  );

  const [loading, setLoading] = useState(false);

  const handleRead = useCallback(
    async ({ currentTarget: { checked } }: h.JSX.TargetedEvent<HTMLInputElement>) => {
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
      } catch {}

      setLoading(false);
    },
    [setLoading],
  );

  return (
    <div class={styles.container}>
      <div class={styles.book} onClick={onClick} style={{ '--cover': `url('/books/${book.id}/cover')` }}>
        {user && <input disabled={loading} type="checkbox" onChange={handleRead} onClick={stopProp} checked={read} />}
      </div>
    </div>
  );
};

export default Book;
