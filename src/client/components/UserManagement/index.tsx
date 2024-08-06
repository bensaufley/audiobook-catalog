import { useSignal, useSignalEffect } from '@preact/signals';
import type { FunctionComponent } from 'preact';
import { NavDropdown } from 'react-bootstrap';

import NewUser from '~client/components/UserManagement/NewUser';
import useEvent from '~client/hooks/useEvent';
import { read } from '~client/signals/Options';
import { Read } from '~client/signals/Options/enums';
import { user, users } from '~client/signals/User';
import User from '~icons/person-fill.svg?react';

const UserManagement: FunctionComponent = () => {
  const selection = useSignal(user.value?.id || '');
  const showNewUser = useSignal(false);

  useSignalEffect(() => {
    selection.value = user.value?.id || '';
  });

  const handleSelect = useEvent((value: string) => {
    switch (value) {
      case '': {
        user.value = undefined;
        break;
      }
      case '--add--': {
        showNewUser.value = true;
        break;
      }
      default: {
        user.value = users.value.find(({ id }) => id === value)!;
      }
    }
  });

  return (
    <>
      <NavDropdown
        title={
          <>
            <User /> User{user.value ? `: ${user.value.username}` : ''}
          </>
        }
        align={{ lg: 'end' }}
      >
        {user.value ? (
          <>
            <NavDropdown.Header>Filter:</NavDropdown.Header>
            <NavDropdown.Item
              as="button"
              active={read.value === Read.All}
              onClick={(e: Event) => {
                e.preventDefault();
                read.value = Read.All;
              }}
            >
              All
            </NavDropdown.Item>
            <NavDropdown.Item
              as="button"
              active={read.value === Read.Unread}
              onClick={(e: Event) => {
                e.preventDefault();
                read.value = Read.Unread;
              }}
            >
              Unread
            </NavDropdown.Item>
            <NavDropdown.Item
              as="button"
              active={read.value === Read.Read}
              onClick={(e: Event) => {
                e.preventDefault();
                read.value = Read.Read;
              }}
            >
              Read
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as="button"
              onClick={(e: Event) => {
                e.preventDefault();
                handleSelect('');
              }}
            >
              Log Out
            </NavDropdown.Item>
          </>
        ) : (
          [...users.value, { id: '--add--', username: '+ New User' }].map((u) => (
            <NavDropdown.Item
              as="button"
              active={user.value?.id === u.id}
              onClick={(e: Event) => {
                e.preventDefault();
                handleSelect(u.id);
              }}
            >
              {u.username}
            </NavDropdown.Item>
          ))
        )}
      </NavDropdown>
      <NewUser signal={showNewUser} />
    </>
  );
};

export default UserManagement;
