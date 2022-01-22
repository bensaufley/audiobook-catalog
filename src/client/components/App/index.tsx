import { FunctionComponent, h } from 'preact';

import '~client/components/App/styles.css';
import Books from '~client/components/Books';
import { OptionsProvider } from '~client/contexts/Options';
import { UserProvider } from '~client/components/contexts/User';
import Nav from '~client/components/Nav';

const App: FunctionComponent = () => (
  <UserProvider>
    <OptionsProvider>
      <>
        <Nav />
        <Books />
      </>
    </OptionsProvider>
  </UserProvider>
);

export default App;
