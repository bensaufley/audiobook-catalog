import { FunctionComponent, h } from 'preact';
import { useCallback } from 'preact/hooks';

import type { AudiobookJSON } from '~db/models/Audiobook';
import styles from '~client/components/Book/styles.module.css';
import BookModal from '~client/components/BookModal';
import { useModal } from '~client/contexts/Modal';

interface Props {
  book: AudiobookJSON;
}

const Book: FunctionComponent<Props> = ({ book }) => {
  const { setContent } = useModal();

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setContent(<BookModal book={book} />);
    },
    [book],
  );

  return (
    <div class={styles.container}>
      <div class={styles.book} onClick={onClick} style={{ '--cover': `url('/books/${book.id}/cover')` }} />
    </div>
  );
};

export default Book;
