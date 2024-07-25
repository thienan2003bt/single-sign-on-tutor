import React from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '../../redux/action/accountAction';

function Header(props) {
    const user = useSelector(state => state.account.userInfo);

    const dispatch = useDispatch();
    const handleLogIn = () => {
        window.location.replace(`${process.env.REACT_APP_SSO_BACKEND_LOGIN}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`);
    }

    const handleLogOut = () => {
        dispatch(handleLogout());
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
                            {user && user?.access_token &&
                                <NavLink className='nav-link' to='#'>Welcome, {user?.username ?? user?.email ?? 'anonymous'}!</NavLink>
                            }
                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                                {(user && user?.access_token)
                                    ? <NavDropdown.Item onClick={() => handleLogOut()}>Logout</NavDropdown.Item>
                                    : <NavDropdown.Item onClick={() => handleLogIn()}>Login</NavDropdown.Item>
                                }

                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;