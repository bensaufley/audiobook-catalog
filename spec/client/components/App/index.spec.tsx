import { render } from '@testing-library/preact';
import { h } from 'preact';

import App from '~client/components/App';
import { mockClient } from '~spec/support/spec-helpers';

describe('~client/components/App', () => {
  it('renders without errors', () => {
    const { container } = render(<App client={mockClient()} />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
