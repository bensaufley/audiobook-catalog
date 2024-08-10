import { useComputed, useSignal } from '@preact/signals';
import type { JSX } from 'preact';

import Modal, { Body, Footer, Header, Title } from '~client/components/Modal';
import useEvent from '~client/hooks/useEvent';
import { selectedBook, selectedBookId, updateBook } from '~client/signals/Options';
import { user } from '~client/signals/User';
import Book from '~icons/book.svg?react';
import External from '~icons/box-arrow-up-right.svg?react';
import Download from '~icons/download.svg?react';

// import styles from '~client/components/BookModal/styles.module.css';

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
};

const BookModal = () => {
  const changingRead = useSignal(false);

  const searchParam = useComputed(
    () =>
      `${encodeURIComponent(selectedBook.value?.title ?? '')} ${
        selectedBook.value?.Authors?.map(({ firstName = '', lastName }) => `${firstName} ${lastName}`) || ''
      }`,
  );

  const read = useSignal(!!selectedBook.value?.UserAudiobooks?.[0]?.read);

  // eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions
  const handleChangeRead: JSX.GenericEventHandler<HTMLInputElement> = useEvent(async function changeRead(e) {
    changingRead.value = true;
    try {
      const resp = await fetch(`/users/books/${selectedBook.value?.id}/read`, {
        headers: {
          'x-audiobook-catalog-user': user.value!.id,
        },
        method: 'POST',
      });

      if (!resp.ok) return;

      read.value = e.currentTarget.checked;
      updateBook({
        id: selectedBookId.peek()!,
        UserAudiobooks: selectedBook.peek()!.UserAudiobooks!.map((v) => ({ ...v, read: e.currentTarget.checked })),
      });
    } finally {
      changingRead.value = false;
    }
  });

  const handleHide = useEvent(() => {
    selectedBookId.value = undefined;
  });

  return (
    <Modal show={!!selectedBook.value} onHide={handleHide}>
      <Header onHide={handleHide}>
        <Title>
          {selectedBook.value?.title}
          {selectedBook.value?.Authors?.length && (
            <small class="d-block">
              by{' '}
              {selectedBook.value?.Authors.map(({ firstName, lastName }) => `${firstName || ''} ${lastName}`).join(
                ', ',
              )}
            </small>
          )}
          {!!selectedBook.value?.Narrators?.length && (
            <small class="d-block">
              read by{' '}
              {selectedBook.value?.Narrators.map(({ firstName, lastName }) => `${firstName || ''} ${lastName}`).join(
                ', ',
              )}
            </small>
          )}
        </Title>
      </Header>
      <Body>
        {selectedBook.value && (
          <img
            class="img-fluid rounded mb-4"
            alt={`Cover for ${selectedBook.value.title}`}
            src={`/books/${selectedBook.value.id}/cover`}
          />
        )}
        {selectedBook.value?.duration && <p>Duration: {formatDuration(selectedBook.value?.duration)}</p>}
        <div class="hstack gap-2">
          <span className="d-block me-auto">View In:</span>
          <a
            class="btn btn-outline-primary"
            href={`https://app.thestorygraph.com/browse?search_term=${searchParam}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span class="d-flex gap-2 align-items-center">
              <span class="flex-grow-1">The StoryGraph</span>
              <span>
                <External />
              </span>
            </span>
          </a>
          <a
            class="btn btn-outline-secondary"
            href={`https://www.librarything.com/search.php?searchtype=101&searchtype=101&sortchoice=0&search=${searchParam}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span class="d-flex gap-2 align-items-center">
              <span class="flex-grow-1">LibraryThing</span>
              <span>
                <External />
              </span>
            </span>
          </a>
        </div>
      </Body>
      <Footer>
        {user.value && (
          <form class="me-auto">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="read"
                role="switch"
                name="read"
                checked={read}
                onChange={handleChangeRead}
                disabled={changingRead}
              />
              <label class="form-check-label" for="read">
                Read
              </label>
            </div>
          </form>
        )}
        <a class="btn btn-primary" href={`/books/${selectedBook.value?.id}/download`}>
          <span class="d-flex gap-2 align-items-center">
            <span>
              <Download />
            </span>
            <span class="flex-grow-1">Download</span>
          </span>
        </a>
        <a
          href={`bookplayer://download?url="${window.location.protocol}//${window.location.host}/books/${selectedBook.value?.id}/download"`}
          class="btn btn-secondary"
        >
          <span class="d-flex gap-2 align-items-center">
            <span>
              <Book />
            </span>
            <span class="flex-grow-1">Bookplayer</span>
          </span>
        </a>
      </Footer>
    </Modal>
  );
};

export default BookModal;
