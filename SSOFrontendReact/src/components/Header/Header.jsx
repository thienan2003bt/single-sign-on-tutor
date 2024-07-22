import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

function Header(props) {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark">
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                            <NavLink to="/about" className="nav-link">About</NavLink>
                        </Nav>

                        <Nav>
                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Login</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;