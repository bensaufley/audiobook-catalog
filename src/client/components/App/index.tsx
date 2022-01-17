import { FunctionComponent, Fragment, h } from 'preact';
import Books from '~client/components/Books';

import '~client/components/App/styles.css';
import { OptionsProvider } from '~client/components/contexts/Options';
import Options from '~client/components/Options';

const App: FunctionComponent = () => (
  <OptionsProvider>
    <>
      <h1>Audiobook Catalog</h1>
      <Options />
      <Books />
    </>
  </OptionsProvider>
);

export default App;
