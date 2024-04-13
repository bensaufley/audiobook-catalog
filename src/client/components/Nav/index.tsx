import type { FunctionComponent } from 'preact';

import UserManagement from '~client/components/UserManagement';
import Options from '~client/contexts/Options/Options';

import styles from '~client/components/Nav/styles.module.css';

const Nav: FunctionComponent = () => (
  <nav class={styles.nav}>
    <h1>Audiobook Catalog</h1>
    <UserManagement />
    <Options />
  </nav>
);

export default Nav;
