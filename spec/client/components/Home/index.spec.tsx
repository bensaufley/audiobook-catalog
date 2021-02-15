import { render } from '@testing-library/preact';
import { h } from 'preact';

import Home from '~client/components/Home';
import { renderWithProviders } from '~spec/support/spec-helpers';

describe('~client/components/Home', () => {
  it('renders without exploding', () => {
    const { container } = renderWithProviders()(<Home />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
