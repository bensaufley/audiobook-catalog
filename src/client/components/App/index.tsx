import '~client/components/App/styles.css';
import '~client/favicon.ico';

import type { FunctionComponent } from 'preact';

import Books from '~client/components/Books';
import Nav from '~client/components/Nav';
import Toasts from '~client/components/Toasts';

const App: FunctionComponent = () => (
  <>
    <Nav />
    <Books />
    <Toasts />
  </>
);

export default App;
