import '~client/components/App/index.css';

import { Client, createClient, Provider as UrqlProvider } from '@urql/preact';
import { FunctionComponent, h } from 'preact';

import styles from '~client/components/App/styles.modules.css';
import Home from '~client/components/Home';
import { LoadingProvider } from '~client/contexts/LoadingContext';
import { SessionProvider } from '~client/contexts/SessionContext';

const App: FunctionComponent<{ client?: Client }> = ({
  client = createClient({ url: '/graphql' }),
}) => (
  <UrqlProvider value={client}>
    <LoadingProvider>
      <SessionProvider>
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
      </SessionProvider>
    </LoadingProvider>
  </UrqlProvider>
);

export default App;
