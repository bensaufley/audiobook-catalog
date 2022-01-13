import { FunctionComponent, h, Fragment } from 'preact';
import Books from '~client/components/Books';

const App: FunctionComponent = () => (
  <>
    <h1>Audiobook Catalog</h1>
    <Books />
  </>
);

export default App;
