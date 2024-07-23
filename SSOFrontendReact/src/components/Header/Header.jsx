import React from 'react';
import './Header.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

function Header(props) {
    const navigate = useNavigate();

    const handleLogin = () => {
        // alert("Click me !");
        // navigate(`${process.env.REACT_APP_SSO_BACKEND}`);
        window.location.replace(`${process.env.REACT_APP_SSO_BACKEND}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`);
        // window.open(`${process.env.REACT_APP_SSO_BACKEND}?serviceURl=${process.env.REACT_APP_SERVICE_URL}`, '_blank');
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark">
                <Container>
                    <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                            <NavLink to="/about" className="nav-link">About</NavLink>
                        </Nav>

                        <Nav>
                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => handleLogin()}>Login</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;