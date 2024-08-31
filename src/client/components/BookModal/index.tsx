import { useComputed, useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import TouchSweep from 'touchsweep';

import Modal, { Body, Footer, Header, Title } from '~client/components/Modal';
import useEvent from '~client/hooks/useEvent';
import { selectedBook, selectedBookId, sortedBooks } from '~client/signals/books';
import { setBookRead } from '~client/signals/books/helpers';
import { page, perPage } from '~client/signals/options';
import { currentUserId } from '~client/signals/user';
import Book from '~icons/book.svg?react';
import External from '~icons/box-arrow-up-right.svg?react';
import Download from '~icons/download.svg?react';
import { clamp } from '~shared/utilities';

// import styles from '~client/components/BookModal/styles.module.css';

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
};

const BookModal = () => {
  const checkRef = useRef<HTMLInputElement>(null);
  const changingRead = useSignal(false);

  const searchParam = useComputed(
    () =>
      `${encodeURIComponent(selectedBook.value?.title ?? '')} ${
        selectedBook.value?.Authors?.map(({ firstName = '', lastName }) => `${firstName} ${lastName}`) || ''
      }`,
  );

  const read = useComputed(
    () => !!selectedBook.value?.UserAudiobooks?.find(({ UserId }) => UserId === currentUserId.value)?.read,
  );

  // eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions
  const handleChangeRead: JSX.GenericEventHandler<HTMLInputElement> = useEvent(async function changeRead(e) {
    e.preventDefault();
    const { checked } = e.currentTarget;
    checkRef.current!.checked = !checked;
    changingRead.value = true;
    if ((await setBookRead(selectedBook.value!.id, checked)) && checkRef.current) {
      checkRef.current.checked = checked;
    }
    changingRead.value = false;
  });

  const handleHide = useEvent(() => {
    selectedBookId.value = undefined;
  });

  const ref = useRef<HTMLDivElement>(null);
  const touchSweep = useRef<TouchSweep>();

  useEffect(() => {
    if (!selectedBook.value) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    touchSweep.current = new TouchSweep(el);

    const moveSelectedBook = (delta: number) => () => {
      const books = sortedBooks.peek();
      if (!books?.length) return;

      const index = books.findIndex((book) => book.id === selectedBookId.peek()) ?? -1;
      if (index < 0) return; // not found

      const newIndex = clamp(0, index + delta, books.length - 1);
      if (index === newIndex) return; // no change - hitting bounds

      selectedBookId.value = books[newIndex]!.id;

      const pageDelta = Math.floor(newIndex / perPage.peek()) - Math.floor(index / perPage.peek());
      if (pageDelta) page.value = page.peek() + pageDelta;
    };

    const handleSwipeLeft = moveSelectedBook(1);
    const handleSwipeRight = moveSelectedBook(-1);

    el.addEventListener('swipeleft', handleSwipeLeft);
    el.addEventListener('swiperight', handleSwipeRight);

    return () => {
      el.removeEventListener('swipeleft', handleSwipeLeft);
      el.removeEventListener('swiperight', handleSwipeRight);
      touchSweep.current?.unbind();
    };
  }, [selectedBook.value]);

  return (
    <Modal show={!!selectedBook.value} innerRef={ref} onHide={handleHide}>
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
            src={`/api/books/${selectedBook.value.id}/cover`}
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
        {currentUserId.value && (
          <form class="me-auto">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="read"
                role="switch"
                name="read"
                checked={read}
                ref={checkRef}
                onChange={handleChangeRead}
                disabled={changingRead}
              />
              <label class="form-check-label" for="read">
                Read
              </label>
            </div>
          </form>
        )}
        <a class="btn btn-primary" href={`/api/books/${selectedBook.value?.id}/download`}>
          <span class="d-flex gap-2 align-items-center">
            <span>
              <Download />
            </span>
            <span class="flex-grow-1">Download</span>
          </span>
        </a>
        <a
          href={`bookplayer://download?url="${window.location.protocol}//${window.location.host}/api/books/${selectedBook.value?.id}/download"`}
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
