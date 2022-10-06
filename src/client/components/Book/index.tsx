import { FunctionComponent, Fragment, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import type { AudiobookJSON } from '~db/models/Audiobook';
import BookModal from '~client/components/BookModal';
import { useModal } from '~client/contexts/Modal';
import { useUser } from '~client/contexts/User';

import styles from '~client/components/Book/styles.module.css';

interface Props {
  book: AudiobookJSON;
}

const stopProp: h.JSX.GenericEventHandler<HTMLElement> = (e) => {
  e.stopPropagation();
};

const Book: FunctionComponent<Props> = ({ book }) => {
  const { setContent } = useModal();

  const [read, setRead] = useState(() => !!book.UserAudiobooks?.some(({ read: r }) => r));

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

        setRead(checked);
      } catch {}

      setLoading(false);
    },
    [setRead, setLoading],
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
