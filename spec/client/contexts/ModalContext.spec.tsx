import { render } from '@testing-library/preact';
import { FunctionComponent, h } from 'preact';
import { useCallback } from 'preact/hooks';
import { act } from 'preact/test-utils';

import { ModalProvider, useModal } from '~client/contexts/ModalContext';

const TestComponent: FunctionComponent<{}> = () => {
  const { clearContent, setContent } = useModal();

  const showModal1 = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setContent(<div data-testid="modal1-content">Modal One Content</div>);
    },
    [setContent],
  );

  const showModal2 = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setContent(<div data-testid="modal2-content">Modal Two Content</div>);
    },
    [setContent],
  );

  const hideModal = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      clearContent();
    },
    [clearContent],
  );

  return (
    <div>
      <button type="button" onClick={showModal1} data-testid="showmodal1">
        Show Modal One
      </button>
      <button type="button" onClick={showModal2} data-testid="showmodal2">
        Show Modal Two
      </button>
      <button type="button" onClick={hideModal} data-testid="hidemodal">
        Hide Modal
      </button>
    </div>
  );
};

describe('~client/contexts/ModalContext', () => {
  it('renders without exploding', () => {
    const { container } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });

  it('renders a modal', async () => {
    const { findByTestId } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>,
    );

    const btn = await findByTestId('showmodal1');

    act(() => {
      btn.click();
    });

    const modalContent = await findByTestId('modal1-content');

    expect(modalContent).not.toBeEmptyDOMElement();
  });

  it('closes a modal', () => {
    const { getByTestId, queryByTestId } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>,
    );

    const btn1 = getByTestId('showmodal1');

    act(() => {
      btn1.click();
    });

    const btn2 = getByTestId('hidemodal');

    act(() => {
      btn2.click();
    });

    const modalContent = queryByTestId('modal1-content');

    expect(modalContent).toBeNull();
  });

  it('updates modal content', () => {
    const { getByTestId, queryByTestId } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>,
    );

    const btn1 = getByTestId('showmodal1');

    act(() => {
      btn1.click();
    });

    const btn2 = getByTestId('showmodal2');

    act(() => {
      btn2.click();
    });

    const modalContent = queryByTestId('modal2-content');

    expect(modalContent).not.toBeNull();
  });
});
