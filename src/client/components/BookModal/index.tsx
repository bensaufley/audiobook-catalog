import { useComputed, useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import { Form, Image, Modal, Stack } from 'react-bootstrap';

import useEvent from '~client/hooks/useEvent';
import { selectedBook, selectedBookId } from '~client/signals/Options';
import { user } from '~client/signals/User';

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
  });

  return (
    <Modal
      show={!!selectedBook.value}
      onHide={() => {
        selectedBookId.value = undefined;
      }}
    >
      <Modal.Header className="flex-column">
        <Image
          fluid
          rounded
          alt={`Cover for ${selectedBook.value?.title}`}
          src={`/books/${selectedBook.value?.id}/cover`}
        />
        <Modal.Title className="mt-2">
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
        {selectedBook.value?.duration && <p>Duration: {formatDuration(selectedBook.value?.duration)}</p>}
        <Stack direction="horizontal" className="gap-2">
          <span className="d-block me-auto">View In:</span>
          <a
            href={`https://app.thestorygraph.com/browse?search_term=${searchParam}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            The StoryGraph
          </a>
          <a
            href={`https://www.librarything.com/search.php?searchtype=101&searchtype=101&sortchoice=0&search=${searchParam}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            LibraryThing
          </a>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        {user && (
          <Form className="me-auto">
            <Form.Check id="read" name="read" checked={read} onChange={handleChangeRead} label="Read" />
          </Form>
        )}
        <a href={`/books/${selectedBook.value?.id}/download`}>Download</a>
        <a
          href={`bookplayer://download?url="${window.location.protocol}//${window.location.host}/books/${selectedBook.value?.id}/download"`}
        >
          Bookplayer
        </a>
      </Modal.Footer>
    </Modal>
  );
};

export default BookModal;
