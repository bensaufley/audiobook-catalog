import '~client/components/App/styles.css';

import type { FunctionComponent } from 'preact';

import Books from '~client/components/Books';
import Nav from '~client/components/Nav';

import Errors from '../Errors';

const App: FunctionComponent = () => (
  <>
    <Nav />
    <Books />
    <Errors />
  </>
);

export default App;
