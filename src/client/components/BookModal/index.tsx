import { FunctionComponent, Fragment, h } from 'preact';

import type Audiobook from '~db/models/Audiobook';

import styles from '~client/components/BookModal/styles.module.css';

interface Props {
  book: Audiobook<unknown>;
  handleHide: () => void;
}

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
};

const BookModal: FunctionComponent<Props> = ({ book, handleHide }) => (
  <>
    <div onClick={handleHide} class={styles.overlay} />
    <div class={styles.modal}>
      <button class={styles.closeButton} type="button" onClick={handleHide}>
        &times;
      </button>
      <img class={styles.cover} src={`/books/${book.id}/cover`} alt={`Cover for ${book.title}`} />
      <h3>{book.title}</h3>
      {book.Authors?.length && (
        <p class={styles.authors}>
          by {book.Authors.map(({ firstName, lastName }) => `${firstName || ''} ${lastName}`).join(', ')}
        </p>
      )}
      {!!book.Narrators?.length && (
        <p class={styles.narrators}>
          read by {book.Narrators.map(({ firstName, lastName }) => `${firstName || ''} ${lastName}`).join(', ')}
        </p>
      )}
      {book.duration && <p class={styles.duration}>Duration: {formatDuration(book.duration)}</p>}
      <div class={styles.buttons}>
        <a href={`/books/${book.id}/download`}>Download</a>
        <a href={`bookplayer://download?url="${location.protocol}//${location.host}/books/${book.id}/download"`}>
          Bookplayer
        </a>
      </div>
    </div>
  </>
);

export default BookModal;
