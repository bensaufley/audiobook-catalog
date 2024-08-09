import { useSignal, useSignalEffect } from '@preact/signals';
import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

import NewUser from '~client/components/UserManagement/NewUser';
import useEvent from '~client/hooks/useEvent';
import { read } from '~client/signals/Options';
import { Read } from '~client/signals/Options/enums';
import { user, users } from '~client/signals/User';
import User from '~icons/person-fill.svg?react';

const UserManagement: FunctionComponent = () => {
  const userMenuOpen = useSignal(false);
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
      <li class="nav-item dropdown align-lg-end">
        <button
          type="button"
          class="nav-link dropdown-toggle"
          onClick={(e) => {
            e.preventDefault();
            userMenuOpen.value = !userMenuOpen.peek();
          }}
          aria-expanded={userMenuOpen}
        >
          <User /> User{user.value ? `: ${user.value.username}` : ''}
        </button>
        <ul class={clsx('dropdown-menu', userMenuOpen.value && 'show')}>
          {user.value ? (
            <>
              <li>
                <h6 class="dropdown-header">Filter:</h6>
              </li>
              <li>
                <button
                  type="button"
                  class={clsx('dropdown-item', read.value === Read.All && 'active')}
                  onClick={(e: Event) => {
                    e.preventDefault();
                    read.value = Read.All;
                  }}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class={clsx('dropdown-item', read.value === Read.Unread && 'active')}
                  onClick={(e: Event) => {
                    e.preventDefault();
                    read.value = Read.Unread;
                  }}
                >
                  Unread
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class={clsx('dropdown-item', read.value === Read.Read && 'active')}
                  onClick={(e: Event) => {
                    e.preventDefault();
                    read.value = Read.Read;
                  }}
                >
                  Read
                </button>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  onClick={(e: Event) => {
                    e.preventDefault();
                    handleSelect('');
                  }}
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            [...users.value, { id: '--add--', username: '+ New User' }].map((u) => (
              <li>
                <button
                  type="button"
                  class={clsx('dropdown-item', user.value?.id === u.id && 'active')}
                  onClick={(e: Event) => {
                    e.preventDefault();
                    handleSelect(u.id);
                  }}
                >
                  {u.username}
                </button>
              </li>
            ))
          )}
        </ul>
      </li>
      <NewUser signal={showNewUser} />
    </>
  );
};

export default UserManagement;
