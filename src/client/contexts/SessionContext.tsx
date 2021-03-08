import { Context } from '@urql/preact';
import jsCookie from 'js-cookie';
import { createContext, FunctionComponent, h } from 'preact';
import { useContext, useState } from 'preact/hooks';

import {
  GetUserDocument,
  GetUserQuery,
  GetUserQueryVariables,
} from '~client/contexts/getUser.generated';
import { useLoading } from '~client/contexts/LoadingContext';
import useDidMount from '~client/hooks/useDidMount';
import type { User } from '~graphql/schema.generated';

export interface Session {
  user: User | null;
}

const SessionContext = createContext<Session>({
  user: null,
});

export default SessionContext;

export const useSession = () => useContext(SessionContext);

export const SessionProvider: FunctionComponent<{ urqlContext?: typeof Context }> = ({
  children,
  urqlContext = Context,
}) => {
  const client = useContext(urqlContext);

  const [session, setSession] = useState<Session>({
    user: null,
  });

  const { startLoading } = useLoading();

  useDidMount(() => {
    (async () => {
      const userCookie = jsCookie.get('audiobook-catalog-user');
      if (!userCookie) return;

      const stopLoading = startLoading();

      try {
        const resp = await client
          .query<GetUserQuery, GetUserQueryVariables>(GetUserDocument, {
            id: userCookie,
          })
          .toPromise();
        if (resp.error) throw resp.error;
        const { data: { getUser } = {} } = resp;
        if (!getUser) throw new Error('neither error nor data returned');

        setSession({
          user: {
            id: userCookie,
            username: getUser.username,
          },
        });
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        stopLoading();
      }
    })();
  });

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};
