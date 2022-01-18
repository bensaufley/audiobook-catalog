import { FunctionComponent, h } from 'preact';
import Options from '~client/components/Options';

import styles from '~client/components/Nav/styles.module.css';

const Nav: FunctionComponent = () => {
  return (
    <nav class={styles.nav}>
      <h1>Audiobook Catalog</h1>
      <Options />
    </nav>
  );
};

export default Nav;
