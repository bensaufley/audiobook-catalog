import { useState } from 'preact/hooks';
import Container from 'react-bootstrap/Container';
import BootstrapNav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import UserManagement from '~client/components/UserManagement';
import Options from '~client/contexts/Options/Options';

const Nav = () => {
  const [show, setShow] = useState(false);

  return (
    <Navbar expand="lg" className="sticky-top border-bottom">
      <Container fluid>
        <Navbar.Brand as="h1">Audiobook Catalog</Navbar.Brand>
        <Navbar.Toggle
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}
        />
        <Navbar.Collapse className={show ? 'show' : ''}>
          <BootstrapNav>
            <Options />
            <UserManagement />
          </BootstrapNav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
