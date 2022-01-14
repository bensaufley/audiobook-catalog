import { FunctionComponent, h, Fragment } from 'preact';
import Books from '~client/components/Books';

import '~client/components/App/styles.css';

const App: FunctionComponent = () => (
  <>
    <h1>Audiobook Catalog</h1>
    <Books />
  </>
);

export default App;
