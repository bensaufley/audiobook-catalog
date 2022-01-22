import { FunctionComponent, h } from 'preact';
import { useCallback } from 'preact/hooks';

import type { AudiobookJSON } from '~db/models/Audiobook';
import styles from '~client/components/Book/styles.module.css';

interface Props {
  book: AudiobookJSON;
  handleClick: (id: string) => void;
}

const Book: FunctionComponent<Props> = ({ book, handleClick }) => {
  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      handleClick(book.id);
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
