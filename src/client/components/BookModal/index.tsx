import { useComputed, useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import { Button, Form, Image, Modal, Stack } from 'react-bootstrap';

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
  const searchParam = useComputed(
    () =>
      `${encodeURIComponent(selectedBook.value?.title ?? '')} ${
        selectedBook.value?.Authors?.map(({ firstName = '', lastName }) => `${firstName} ${lastName}`) || ''
      }`,
  );

  const read = useSignal(!!selectedBook.value?.UserAudiobooks?.[0]?.read);

  const handleChangeRead: JSX.GenericEventHandler<HTMLInputElement> = useEvent(async (e) => {
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
  });

  return (
    <Modal
      show={!!selectedBook.value}
      onHide={() => {
        selectedBookId.value = undefined;
      }}
    >
      <Modal.Header closeButton className="align-items-start">
        <Modal.Title className="flex-grow-1">
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
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image
          fluid
          rounded
          alt={`Cover for ${selectedBook.value?.title}`}
          src={`/books/${selectedBook.value?.id}/cover`}
          className="mb-4"
        />
        {selectedBook.value?.duration && <p>Duration: {formatDuration(selectedBook.value?.duration)}</p>}
        <Stack direction="horizontal" className="gap-2">
          <span className="d-block me-auto">View In:</span>
          <Button
            as="a"
            variant="outline-primary"
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
          </Button>
          <Button
            as="a"
            variant="outline-secondary"
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
          </Button>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        {user.value && (
          <Form className="me-auto">
            <Form.Check type="switch" id="read" name="read" checked={read} onChange={handleChangeRead} label="Read" />
          </Form>
        )}
        <Button as="a" href={`/books/${selectedBook.value?.id}/download`}>
          <span class="d-flex gap-2 align-items-center">
            <span>
              <Download />
            </span>
            <span class="flex-grow-1">Download</span>
          </span>
        </Button>
        <Button
          as="a"
          href={`bookplayer://download?url="${window.location.protocol}//${window.location.host}/books/${selectedBook.value?.id}/download"`}
          variant="secondary"
        >
          <span class="d-flex gap-2 align-items-center">
            <span>
              <Book />
            </span>
            <span class="flex-grow-1">Bookplayer</span>
          </span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookModal;
