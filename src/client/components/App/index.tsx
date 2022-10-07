import { Fragment, FunctionComponent, h } from 'preact';

import '~client/components/App/styles.css';
import Books from '~client/components/Books';
import Nav from '~client/components/Nav';
import { ModalProvider } from '~client/contexts/Modal';
import { OptionsProvider } from '~client/contexts/Options';
import { UserProvider } from '~client/contexts/User';

const App: FunctionComponent = () => (
  <UserProvider>
    <OptionsProvider>
      <ModalProvider>
        <>
          <Nav />
          <Books />
        </>
      </ModalProvider>
    </OptionsProvider>
  </UserProvider>
);

export default App;
