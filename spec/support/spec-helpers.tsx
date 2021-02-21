import { render } from '@testing-library/preact';
import { Client, Provider } from '@urql/preact';
import { h, VNode } from 'preact';
import { never } from 'wonka';

export const mockClient = (c: Partial<Client> = {}) =>
  ({
    executeQuery: jest.fn(() => never),
    executeMutation: jest.fn(() => never),
    executeSubscription: jest.fn(() => never),
    ...c,
  } as Client);

export const renderWithProviders = ({ client = mockClient() }: { client?: Client } = {}) => (
  children: VNode,
) => render(<Provider value={client}>{children}</Provider>);
