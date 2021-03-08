import { render } from '@testing-library/preact';
import { h } from 'preact';
import { useCallback } from 'preact/hooks';

import { LoadingProvider, useLoading } from '~client/contexts/LoadingContext';

const TestComponent: FunctionComponent<{}> = () => {
  const { startLoading } = useLoading();

  const startLoad1 = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setTimeout(startLoading(), 1000);
    },
    [startLoading],
  );

  const startLoad2 = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setTimeout(startLoading(), 2000);
    },
    [startLoading],
  );

  return (
    <div>
      <button type="button" onClick={startLoad1} data-testid="startload1">
        Start Load One
      </button>
      <button type="button" onClick={startLoad2} data-testid="startload2">
        Start Load Two
      </button>
    </div>
  );
};

describe('~client/contexts/LoadingContext', () => {
  it('renders without exploding', () => {
    const { container } = render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
