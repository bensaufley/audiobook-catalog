import { useComputed, useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import TouchSweep from 'touchsweep';

import Modal, { Body, Footer, Header } from '~client/components/Modal';
import useEvent from '~client/hooks/useEvent';
import { chooseBestContrast } from '~client/shared/colors';
import { selectedBook, selectedBookId, sortedBooks, tags } from '~client/signals/books';
import { setBookRead } from '~client/signals/books/helpers';
import { addTagToBook, makeTag, removeTagFromBook } from '~client/signals/books/tagHelpers';
import { page, perPage } from '~client/signals/options';
import { currentUserId } from '~client/signals/user';
import ArrowClockwise from '~icons/arrow-clockwise.svg?react';
import Book from '~icons/book.svg?react';
import CheckCircleFill from '~icons/check-circle-fill.svg?react';
import Circle from '~icons/circle.svg?react';
import Download from '~icons/download.svg?react';
import Plus from '~icons/plus.svg?react';
import X from '~icons/x.svg?react';
import { clamp } from '~shared/utilities';

import ExternalLinks from './ExternalLinks';

// import styles from '~client/components/BookModal/styles.module.css';

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % (60 * 60)) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
};

const randomHexColor = () =>
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');

const BookModal = () => {
  const changingRead = useSignal(false);
  const showAddTagDropdown = useSignal(false);

  const newTagBackgroundColor = useSignal(randomHexColor());
  const newTagName = useSignal('');

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

  const addTag = useEvent(async (e: Event) => {
    e.preventDefault();

    if (!makeTag(newTagName.value, `#${newTagBackgroundColor.value}`, selectedBookId.value!)) return;

    showAddTagDropdown.value = false;
    newTagName.value = '';
    newTagBackgroundColor.value = randomHexColor();
  });

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
            {tags.value
              ?.filter(({ AudiobookTags }) =>
                AudiobookTags?.some(({ AudiobookId }) => AudiobookId === selectedBook.value?.id),
              )
              .map(({ color, name }) => (
                <span
                  key={name}
                  class="badge me-1"
                  style={{ backgroundColor: `#${color}`, color: chooseBestContrast(`#${color}`, '#000', '#fff') }}
                >
                  <span>{name}</span>
                  <button
                    type="button"
                    class="bg-transparent border-0 p-0"
                    onClick={async (e) => {
                      e.preventDefault();
                      removeTagFromBook(name, selectedBookId.value!);
                    }}
                    aria-label={`Remove Tag: ${name}`}
                    style={{ color: chooseBestContrast(`#${color}`, '#000', '#fff') }}
                  >
                    <X />
                  </button>
                </span>
              ))}
            <div class="btn-group">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  showAddTagDropdown.value = !showAddTagDropdown.value;
                }}
                type="button"
                class="btn bg-transparent border-0 text-body dropdown-toggle"
              >
                Add Tag
              </button>
              <ul
                class={clsx('dropdown-menu', showAddTagDropdown.value && 'show')}
                style={{ width: '25rem', maxWidth: '100vw' }}
              >
                {tags.value
                  ?.toSorted()
                  .filter(
                    ({ AudiobookTags }) =>
                      !AudiobookTags?.some(({ AudiobookId }) => AudiobookId === selectedBookId.value),
                  )
                  .map(({ color, name }) => (
                    <li>
                      <button
                        type="button"
                        class="dropdown-item"
                        onClick={async (e) => {
                          e.preventDefault();
                          if (!addTagToBook(name, selectedBookId.value!)) return;

                          showAddTagDropdown.value = false;
                          newTagName.value = '';
                          newTagBackgroundColor.value = randomHexColor();
                        }}
                      >
                        <div
                          class="badge me-1"
                          style={{
                            backgroundColor: `#${color}`,
                            color: chooseBestContrast(`#${color}`, '#000', '#fff'),
                          }}
                        >
                          {name}
                        </div>
                      </button>
                    </li>
                  ))}
                {!!tags.value?.filter(
                  ({ AudiobookTags }) =>
                    !AudiobookTags?.some(({ AudiobookId }) => AudiobookId === selectedBookId.value),
                ).length && <li class="dropdown-divider" />}
                <li>
                  <form class="input-group p-2" onSubmit={addTag}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        newTagBackgroundColor.value = randomHexColor();
                      }}
                      class="input-group-text"
                      style={{
                        backgroundColor: `#${newTagBackgroundColor}`,
                        color: chooseBestContrast(`#${newTagBackgroundColor.value}`, '#000', '#fff'),
                      }}
                      aria-label="New Tag Color"
                    >
                      <ArrowClockwise />
                    </button>
                    <input
                      type="text"
                      class="form-control flex-shrink-0 flex-grow-0"
                      placeholder="Color"
                      value={newTagBackgroundColor}
                      onInput={(e) => {
                        newTagBackgroundColor.value = e.currentTarget.value;
                      }}
                      style={{ width: '6rem' }}
                    />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Tag Name"
                      value={newTagName}
                      onInput={(e) => {
                        newTagName.value = e.currentTarget.value;
                      }}
                    />
                    <button type="submit" class="btn btn-primary" aria-label="Add Tag">
                      <Plus />
                    </button>
                  </form>
                </li>
              </ul>
            </div>
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
