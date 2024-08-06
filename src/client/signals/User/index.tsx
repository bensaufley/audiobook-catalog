import { effect, Signal } from '@preact/signals';
import dayjs from 'dayjs';
import cookie from 'js-cookie';

export interface User {
  id: string;
  username: string;
}

const userCookieName = 'audiobook-catalog-user';

const setCookie = (user: User) => {
  cookie.set(userCookieName, JSON.stringify(user), {
    expires: dayjs().add(1, 'month').toDate(),
    sameSite: 'strict',
    path: '/',
    secure: false, // audiobook-catalog is not served via HTTPS
    ...(import.meta.env.DEV ? {} : { domain: window.location.host }),
  });
};

export const user = new Signal<User | undefined>(
  (() => {
    const cookieUser = cookie.get(userCookieName);
    if (!cookieUser) return undefined;

    const user = JSON.parse(cookieUser);
    setCookie(user); // extend cookie expiration
    return user;
  })(),
);

effect(() => {
  if (user.value) {
    setCookie(user.value);
  } else {
    cookie.remove(userCookieName);
  }
});

export const users = new Signal<User[]>([]);

export const refreshUsers = async () => {
  try {
    const res = await fetch('/users');
    const us: User[] = await res.json();
    users.value = us;
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(ex);
  }
};
