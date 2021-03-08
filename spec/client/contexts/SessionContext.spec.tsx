import { render } from '@testing-library/preact';
import { Client, OperationResult, Provider } from '@urql/preact';
import jsCookie from 'js-cookie';
import { FunctionComponent, h } from 'preact';
import { fromValue } from 'wonka';

import { GetUserQuery, GetUserQueryVariables } from '~client/contexts/getUser.generated';
import { SessionProvider, useSession } from '~client/contexts/SessionContext';
import { mockClient, withPromise } from '~spec/support/spec-helpers';

const TestChild: FunctionComponent<{}> = () => {
  const { user } = useSession();

  return (
    <div>
      <div data-testid="userid">{user?.id}</div>
      <div data-testid="username">{user?.username}</div>
    </div>
  );
};

describe('~client/contexts/SessionContext', () => {
  beforeEach(() => {
    console.log(jsCookie.get('audiobook-catalog-user'));
  });

  afterEach(() => {
    jsCookie.remove('audiobook-catalog-user');
  });

  it('renders default state', async () => {
    const { findByTestId } = render(
      <SessionProvider>
        <TestChild />
      </SessionProvider>,
    );

    expect(await findByTestId('userid')).toHaveTextContent('');
    expect(await findByTestId('username')).toHaveTextContent('');
  });

  it('renders with user state', async () => {
    const mockQuery = jest.fn<any, Parameters<Client['query']>>(() =>
      withPromise(
        fromValue<OperationResult<GetUserQuery, GetUserQueryVariables>>({
          operation: {} as any,
          data: {
            getUser: {
              username: 'myuser',
            },
          },
        }),
      ),
    );
    jsCookie.set('audiobook-catalog-user', 'asdf1234');

    const { findByTestId } = render(
      <Provider
        value={mockClient({
          query: mockQuery,
        })}
      >
        <SessionProvider>
          <TestChild />
        </SessionProvider>
      </Provider>,
    );

    expect(await findByTestId('userid')).toHaveTextContent('asdf1234');
    expect(await findByTestId('username')).toHaveTextContent('myuser');
  });
});
