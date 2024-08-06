import { type Signal, useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import { Button, Form, Modal } from 'react-bootstrap';

import useEvent from '~client/hooks/useEvent';
import { refreshUsers, user } from '~client/signals/User';

const NewUser = ({ signal }: { signal: Signal<boolean> }) => {
  const username = useSignal('');

  const error = useSignal<string>();

  const handleChange: JSX.GenericEventHandler<HTMLInputElement> = useEvent(({ currentTarget }) => {
    username.value = currentTarget.value;
  });

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = useEvent(async (e) => {
    e.preventDefault();
    error.value = undefined;
    if (username.value === '--add--') {
      error.value = 'Invalid username';
      return;
    }
    try {
      const resp = await fetch('/users/', {
        method: 'POST',
        body: JSON.stringify({ username }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.message);

      await refreshUsers();
      user.value = json;
      // eslint-disable-next-line no-param-reassign
      signal.value = false;
    } catch (err) {
      error.value = (err as Error).message;
    }
  });

  return (
    <Modal
      show={signal.value}
      onHide={() => {
        // eslint-disable-next-line no-param-reassign
        signal.value = false;
      }}
    >
      <Modal.Header>
        <Modal.Title>Create New User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error.value && <p>Error: {error}</p>}
          <Form.Control name="username" onChange={handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Create</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NewUser;
