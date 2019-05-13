import React from 'react';
import {Link} from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap'
import {AuthUserContext} from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <NavigationAuth authUser={authUser}/>
            ) : (
                <NavigationNonAuth/>
            )
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({authUser}) => (

        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Cervica</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto ">
                    <Nav.Link as={Link} to={ROUTES.LANDING}>Landing</Nav.Link>
                    <Nav.Link as={Link} to={ROUTES.HOME}>Home</Nav.Link>
                    <Nav.Link as={Link} to={ROUTES.ACCOUNT}>Account</Nav.Link>
                    {!!authUser.roles[ROLES.ADMIN] && (
                        <Nav.Link as={Link} to={ROUTES.ADMIN}>Admin</Nav.Link>
                    )}
                    <Nav.Item> <SignOutButton/></Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

);

const NavigationNonAuth = () => (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Cervica</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto ">
                <Nav.Link as={Link} to={ROUTES.LANDING}>Landing</Nav.Link>
                <Nav.Link as={Link} to={ROUTES.SIGN_IN}>Sign In</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default Navigation;
