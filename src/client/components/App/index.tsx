import '~client/components/App/styles.css';

import type { FunctionComponent } from 'preact';

import Books from '~client/components/Books';
import Nav from '~client/components/Nav';
import { Modal } from '~client/signals/Modal';

const App: FunctionComponent = () => (
  <>
    <Nav />
    <Books />
    <Modal />
  </>
);

export default App;
