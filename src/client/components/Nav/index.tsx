import { FunctionComponent, h } from 'preact';

import styles from '~client/components/Nav/styles.module.css';
import Options from '~client/contexts/Options/Options';

const Nav: FunctionComponent = () => {
  return (
    <nav class={styles.nav}>
      <h1>Audiobook Catalog</h1>
      <Options />
    </nav>
  );
};

export default Nav;
