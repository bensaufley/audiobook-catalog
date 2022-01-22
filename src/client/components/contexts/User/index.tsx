import cookie from 'js-cookie';
import { createContext, FunctionComponent, h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

export interface UserFields {
  id: string;
  username: string;
}

export interface User {
  user: UserFields | undefined;
}

const UserContext = createContext<User>({ user: undefined });

export const useUser = () => useContext(UserContext);

export const UserProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<UserFields>();
  const [users, setUsers] = useState<UserFields[]>();

  useEffect(() => {
    const cookieUser = cookie.get('audiobook-catalog-user');
    if (cookieUser) setUser(JSON.parse(cookieUser));
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch('/users');
      setUsers(await res.json());
    })();
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};
