import { render } from '@testing-library/preact';
import { Client, Provider } from '@urql/preact';
import { h, VNode } from 'preact';

export const mockClient = (c: Partial<Client> = {}) =>
  ({
    executeQuery: jest.fn(() => undefined),
    executeMutation: jest.fn(() => undefined),
    executeSubscription: jest.fn(() => undefined),
    ...c,
  } as Client);

export const renderWithProviders = ({ client = mockClient() }: { client?: Client } = {}) => (
  children: VNode
) => render(<Provider value={client}>{children}</Provider>);
