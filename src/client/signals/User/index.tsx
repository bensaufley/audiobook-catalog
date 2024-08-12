import { computed, effect, Signal } from '@preact/signals';
import dayjs from 'dayjs';
import cookie from 'js-cookie';

import type { UserAttributes } from '~db/models/User';
import type User from '~db/models/User';

const userCookieName = 'audiobook-catalog-user';

const setCookie = (id: string) => {
  cookie.set(userCookieName, id, {
    expires: dayjs().add(1, 'month').toDate(),
    sameSite: 'lax',
    path: '/',
    secure: false, // audiobook-catalog is not served via HTTPS
    domain: window.location.hostname,
  });
};

export const currentUserId = new Signal<string | undefined>(
  (() => {
    const cookieUserId = cookie.get(userCookieName);
    if (!cookieUserId) return undefined;

    setCookie(cookieUserId); // extend cookie expiration
    return cookieUserId;
  })(),
);

export const currentUser = computed(() => users.value.find(({ id }) => id === currentUserId.value));

effect(() => {
  if (currentUserId.value) {
    setCookie(currentUserId.value);
  } else {
    cookie.remove(userCookieName);
  }
});

export const users = new Signal<UserAttributes[]>([]);

export const fetchingUsers = new Signal(false);

export const refreshUsers = async () => {
  if (fetchingUsers.peek()) return;

  try {
    fetchingUsers.value = true;
    const res = await fetch('/users');
    const us: User[] = await res.json();
    users.value = us;
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);
  } finally {
    fetchingUsers.value = false;
  }
};
