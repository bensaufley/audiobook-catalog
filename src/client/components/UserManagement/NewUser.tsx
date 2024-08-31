import { type Signal, useSignal } from '@preact/signals';
import type { JSX } from 'preact';

import Modal, { Body, Footer, Header, Title } from '~client/components/Modal';
import { createUser } from '~client/fetches';
import useEvent from '~client/hooks/useEvent';
import { currentUserId } from '~client/signals/user';
import { refreshUsers } from '~client/signals/user/helpers';
import Check from '~icons/check.svg?react';

import { clearError, setError } from '../Errors';

const NewUser = ({ signal }: { signal: Signal<boolean> }) => {
  const username = useSignal('');

  const handleChange: JSX.GenericEventHandler<HTMLInputElement> = useEvent(({ currentTarget }) => {
    username.value = currentTarget.value;
  });

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = useEvent(async (e) => {
    e.preventDefault();
    clearError('user-create');
    if (username.value === '--add--') {
      setError('Invalid username', 'error', 'user-create');
      return;
    }
    try {
      const resp = await createUser({ username });
      if (resp.result === 'error') throw new Error(resp.error);

      await refreshUsers();
      currentUserId.value = resp.data;
      // eslint-disable-next-line no-param-reassign
      signal.value = false;
    } catch (err) {
      setError((err as Error).message ?? 'An unexpected error occurred.', 'error', 'user-create');
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
      <Header
        onHide={() => {
          // eslint-disable-next-line no-param-reassign
          signal.value = false;
        }}
      >
        <Title>Create New User</Title>
      </Header>
      <form onSubmit={handleSubmit}>
        <Body>
          <label for="username" class="form-label">
            Username
          </label>
          <input type="text" class="form-control" name="username" onInput={handleChange} />
        </Body>
        <Footer>
          <button class="btn btn-primary" type="submit">
            <Check /> Create
          </button>
        </Footer>
      </form>
    </Modal>
  );
};

export default NewUser;
