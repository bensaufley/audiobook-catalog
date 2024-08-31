import { useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

import NewUser from '~client/components/UserManagement/NewUser';
import useEvent from '~client/hooks/useEvent';
import { read, showUpNext } from '~client/signals/options';
import { Read } from '~client/signals/options/enums';
import { currentUser, currentUserId, fetchingUsers, users } from '~client/signals/User';
import User from '~icons/person-fill.svg?react';

const UserManagement: FunctionComponent = () => {
  const userMenuOpen = useSignal(false);
  const showNewUser = useSignal(false);

  const handleSelect = useEvent((value: string) => {
    switch (value) {
      case '': {
        currentUserId.value = undefined;
        break;
      }
      case '--add--': {
        showNewUser.value = true;
        break;
      }
      default: {
        currentUserId.value = value;
      }
    }
  });

  if (fetchingUsers.value) {
    return (
      <li class="nav-item dropdown align-lg-end">
        <button type="button" class="nav-link dropdown-toggle" disabled aria-expanded={userMenuOpen}>
          <User /> Loading users…
        </button>
      </li>
    );
  }

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
          <User /> User{currentUser.value ? `: ${currentUser.value.username}` : ''}
        </button>
        <ul class={clsx('dropdown-menu', userMenuOpen.value && 'show')}>
          {currentUser.value ? (
            <>
              <li>
                <button
                  type="button"
                  class={clsx('dropdown-item', showUpNext.value && 'active')}
                  onClick={() => {
                    showUpNext.value = !showUpNext.value;
                  }}
                >
                  Up Next
                </button>
              </li>
              <li class="dropdown-divider" />
              <li>
                <h6 class="dropdown-header">Filter:</h6>
              </li>
              <li>
                <button
                  type="button"
                  class={clsx('dropdown-item', !showUpNext.value && read.value === Read.All && 'active')}
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
                  class={clsx('dropdown-item', !showUpNext.value && read.value === Read.Unread && 'active')}
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
                  class={clsx('dropdown-item', !showUpNext.value && read.value === Read.Read && 'active')}
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
                  class={clsx('dropdown-item', currentUserId.value === u.id && 'active')}
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
