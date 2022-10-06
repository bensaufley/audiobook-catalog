import cookie from 'js-cookie';
import { createContext, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { noop } from '~shared/utilities';

export interface UserFields {
  id: string;
  username: string;
}

export interface UserValues {
  user: UserFields | undefined;
  users: UserFields[];
}

export type User = UserValues & {
  refreshUsers: () => Promise<void> | void;
  setUser: (user: UserFields | null) => void;
};

const UserContext = createContext<User>({ refreshUsers: noop, setUser: noop, user: undefined, users: [] });

export const useUser = () => useContext(UserContext);

const userCookieName = 'audiobook-catalog-user';

export const UserProvider: FunctionComponent = ({ children }) => {
  const [user, setUserState] = useState<UserFields>(() => {
    const cookieUser = cookie.get(userCookieName);
    if (cookieUser) return JSON.parse(cookieUser);
    return undefined;
  });
  const [users, setUsers] = useState<UserFields[]>([]);

  const refreshUsers = useCallback(async () => {
    const res = await fetch('/users');
    const us: UserFields[] = await res.json();
    setUsers(us);
  }, [setUsers]);

  useEffect(() => {
    refreshUsers().catch(console.error);
  }, []);

  const setUser = useCallback(
    (user: UserFields | null) => {
      if (user) {
        cookie.set(userCookieName, JSON.stringify(user));
        setUserState(user);
      } else {
        cookie.remove(userCookieName);
        setUserState(undefined);
      }
    },
    [setUserState],
  );

  const value: User = useMemo(() => ({ refreshUsers, setUser, user, users }), [refreshUsers, setUser, user, users]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
