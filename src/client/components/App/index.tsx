import '~client/components/App/index.css';

import { Client, createClient, Provider } from '@urql/preact';
import { FunctionComponent, h } from 'preact';

import styles from '~client/components/App/styles.modules.css';
import Home from '~client/components/Home';

const App: FunctionComponent<{ client?: Client }> = ({
  client = createClient({ url: '/graphql' }),
}) => (
  <Provider value={client}>
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <header class={styles.siteHeader}>
      <h1>Audiobook Catalog</h1>
    </header>
    <nav />
    <main>
      <Home />
    </main>
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Macondo+Swash+Caps&display=swap"
      rel="stylesheet"
    />
  </Provider>
);

export default App;
