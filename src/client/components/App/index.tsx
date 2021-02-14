import { createClient, Provider } from '@urql/preact';
import { FunctionComponent, h } from 'preact';

import Home from '~client/components/Home';

const client = createClient({ url: '/graphql' });

const App: FunctionComponent = () => (
  <Provider value={client}>
    <Home />
  </Provider>
);

export default App;
