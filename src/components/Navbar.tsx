import { Container, Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";

const StyledNavbar = styled(Navbar)`
  background-color: #81a6e6;
  color: #fff;
  cursor: pointer;
`


export const NavbarLink: React.FC = () => {
  return (
    <StyledNavbar>
      <Navbar >
        <Container>
          <Navbar.Brand href="#home">UnlockHerTech</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#podcasts">Podcasts</Nav.Link>
            <Nav.Link href="#education">Education</Nav.Link>
            <Nav.Link href="#aboutUs">About us</Nav.Link>
            <Nav.Link href="#contactUs">Contact us</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      </StyledNavbar>
  );
};
