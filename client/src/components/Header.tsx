// components/Header.tsx
import { useState } from "react";
import { useNavigate, NavLink as RouterNavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../services/store";
import { setLogOut } from "../services/user/userSlice";
import SignalRService from "../services/signalR/SignalRService";
import { toast } from "react-toastify";

import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export default function Header() {
    const { loggedIn, user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        dispatch(setLogOut());
        SignalRService.stopUserRoomConnection();
        toast.success("User logged out.");
        navigate("/");
    };

    return (
        <>
            <Navbar expand="lg" bg="light" className="mb-3" sticky="top">
                <Container fluid>
                    <Navbar.Brand as={RouterNavLink} to="/">SmartyParty</Navbar.Brand>

                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                            console.log({
                                state: SignalRService.getSignalRConnection()?.state,
                                id: SignalRService.getSignalRConnection()?.connectionId,
                            })
                        }
                    >
                        Conn
                    </Button>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto">
                            {!loggedIn ? (
                                <>
                                    <Button variant="outline-primary" className="me-2" onClick={() => setShowLogin(true)}>
                                        Login
                                    </Button>
                                    <Button variant="outline-success" onClick={() => setShowRegister(true)}>
                                        Register
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline-dark" onClick={() => setShowUserMenu(true)}>
                                    {user?.username}
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Login Offcanvas */}
            <Offcanvas show={showLogin} onHide={() => setShowLogin(false)} placement="end" backdrop={true}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Login</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <LoginForm />
                </Offcanvas.Body>
            </Offcanvas>

            {/* Register Offcanvas */}
            <Offcanvas show={showRegister} onHide={() => setShowRegister(false)} placement="end" backdrop={true}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Register</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <RegisterForm />
                </Offcanvas.Body>
            </Offcanvas>

            {/* User Offcanvas */}
            <Offcanvas show={showUserMenu} onHide={() => setShowUserMenu(false)} placement="end" backdrop={true}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{user?.email}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column gap-2">
                    <Button variant="primary" className="w-100">Profile</Button>
                    <Button variant="warning" className="w-100">Create room</Button>
                    <Button variant="danger" className="w-100" onClick={handleLogout}>Log Out</Button>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
