import { useComputed, useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import TouchSweep from 'touchsweep';

import Modal, { Body, Footer, Header } from '~client/components/Modal';
import useEvent from '~client/hooks/useEvent';
import { selectedBook, selectedBookId, sortedBooks } from '~client/signals/books';
import { setBookRead } from '~client/signals/books/helpers';
import { page, perPage } from '~client/signals/options';
import { currentUserId } from '~client/signals/user';
import Book from '~icons/book.svg?react';
import CheckCircleFill from '~icons/check-circle-fill.svg?react';
import Circle from '~icons/circle.svg?react';
import Download from '~icons/download.svg?react';
import { clamp } from '~shared/utilities';

import ExternalLinks from './ExternalLinks';
import TagPicker from './TagPicker';
import Tags from './Tags';

// import styles from '~client/components/BookModal/styles.module.css';

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
};

const BookModal = () => {
  const changingRead = useSignal(false);

  const read = useComputed(
    () => !!selectedBook.value?.UserAudiobooks?.find(({ UserId }) => UserId === currentUserId.value)?.read,
  );

  // eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions
  const handleChangeRead: JSX.MouseEventHandler<HTMLButtonElement> = useEvent(async function changeRead(e) {
    e.preventDefault();
    changingRead.value = true;
    await setBookRead(selectedBook.value!.id, !read.peek());
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
      <Header onHide={handleHide} />
      <Body>
        <div class="row">
          <div class="col-4">
            {selectedBook.value && (
              <img
                class="img-fluid rounded mb-4"
                alt={`Cover for ${selectedBook.value.title}`}
                src={`/api/books/${selectedBook.value.id}/cover`}
              />
            )}
          </div>
          <div class="col-8">
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
            {selectedBook.value?.duration && <small>Duration: {formatDuration(selectedBook.value?.duration)}</small>}
            <hr />
            <Tags />
            <TagPicker />
          </div>
        </div>
        <small class="d-block mb-2">View In:</small>
        <div class="btn-group-vertical col-12 d-xl-none">
          <ExternalLinks />
        </div>
        <div class="btn-group col-12 d-none d-xl-flex">
          <ExternalLinks />
        </div>
      </Body>
      <Footer>
        {currentUserId.value && (
          <form class="me-auto">
            <button
              onClick={handleChangeRead}
              disabled={changingRead}
              type="button"
              class={clsx(
                'border-0 bg-transparent small d-flex align-items-center gap-2',
                read.value ? 'text-success' : 'text-body',
              )}
            >
              {read.value ? <CheckCircleFill /> : <Circle />}
              <span>Read</span>
            </button>
          </form>
        )}
        <div class="btn-group">
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
        </div>
      </Footer>
    </Modal>
  );
};

export default BookModal;
