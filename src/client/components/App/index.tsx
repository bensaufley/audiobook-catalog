import { FunctionComponent, Fragment, h } from 'preact';
import Books from '~client/components/Books';

import '~client/components/App/styles.css';
import { OptionsProvider } from '~client/components/contexts/Options';
import Nav from '~client/components/Nav';

const App: FunctionComponent = () => (
  <OptionsProvider>
    <>
      <Nav />
      <Books />
    </>
  </OptionsProvider>
);

export default App;
