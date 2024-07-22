import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

function Header(props) {
    return (
        <>
            {/* <div className="top-nav">
                <Link className="active" to="/">Home</Link>
                <Link to="/news">News</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/about">About</Link>
            </div>

            <div style={{ paddingLeft: "16px" }}>
                <h2>Top Navigation Example</h2>
                <p>Some content..</p>
            </div> */}

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