import { FunctionComponent, Fragment, h } from 'preact';

import type Audiobook from '~db/models/Audiobook';

import styles from '~client/components/BookModal/styles.module.css';
import { useMemo } from 'preact/hooks';

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

const BookModal: FunctionComponent<Props> = ({ book, handleHide }) => {
  const searchParam = useMemo(() => {
    return `${encodeURIComponent(book.title)} ${
      book.Authors?.map(({ firstName = '', lastName }) => `${firstName} ${lastName}`) || ''
    }`;
  }, [book.title, book.Authors]);
  return (
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
        <div class={styles.outbound}>
          <p>View In:</p>
          <ul>
            <li>
              <a href={`https://app.thestorygraph.com/browse?search_term=${searchParam}`} target="_blank">
                The StoryGraph
              </a>
            </li>
            <li>
              <a
                href={`https://www.librarything.com/search.php?searchtype=101&searchtype=101&sortchoice=0&search=${searchParam}`}
                target="_blank"
              >
                LibraryThing
              </a>
            </li>
          </ul>
        </div>
        <div class={styles.buttons}>
          <a href={`/books/${book.id}/download`}>Download</a>
          <a href={`bookplayer://download?url="${location.protocol}//${location.host}/books/${book.id}/download"`}>
            Bookplayer
          </a>
        </div>
      </div>
    </>
  );
};

export default BookModal;
