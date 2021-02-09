import { createClient, Provider } from '@urql/preact';
import { FunctionComponent, h } from 'preact';

const client = createClient({ url: '' });

const App: FunctionComponent = () => (
  <Provider value={client}>
    <div>
      <h1>Audiobook Catalog</h1>
    </div>
  </Provider>
);

export default App;
