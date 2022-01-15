import { FunctionComponent, Fragment, h } from 'preact';

import type Audiobook from '~db/models/Audiobook';

import styles from '~client/components/Book/styles.module.css';
import { useCallback } from 'preact/hooks';

interface Props {
  book: Audiobook<unknown>;
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
