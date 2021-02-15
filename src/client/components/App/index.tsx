import { Client, createClient, Provider } from '@urql/preact';
import { FunctionComponent, h } from 'preact';

import Home from '~client/components/Home';

const App: FunctionComponent<{ client?: Client }> = ({
  client = createClient({ url: '/graphql' }),
}) => (
  <Provider value={client}>
    <Home />
  </Provider>
);

export default App;
