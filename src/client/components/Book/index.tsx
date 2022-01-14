import { Fragment, FunctionComponent, h } from 'preact';

import type Audiobook from '~db/models/Audiobook';

import styles from '~client/components/Book/styles.module.css';

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
};

const Book: FunctionComponent<{ book: Audiobook<unknown> }> = ({ book }) => (
  <div class={styles.container} style={{ backgroundImage: `url('/books/${book.id}/cover')` }}>
    <div class={styles.baseContent}>
      <p>
        <i>{book.title}</i> by {book.Authors?.map(({ firstName, lastName }) => `${firstName} ${lastName}`)}
        {book.duration && <> ({formatDuration(book.duration)})</>}
      </p>
      <p>
        <a href={`/books/${book.id}/download`}>Download</a>
        <a href={`bookplayer://download?url="${location.protocol}//${location.host}/books/${book.id}/download"`}>
          Bookplayer
        </a>
      </p>
    </div>
  </div>
);

export default Book;
