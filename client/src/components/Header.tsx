// components/Header.tsx
import { useEffect, useState } from "react";
import { useNavigate, NavLink as RouterNavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../services/store";
import { setLogOut } from "../services/user/userSlice";
import SignalRService from "../services/signalR/SignalRService";
import { toast } from "react-toastify";
import { Navbar, Nav, Container, Offcanvas, Button, Accordion, Image, Col } from "react-bootstrap";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import CreateRoomForm from "./CreateRoomForm";

export default function Header() {
	const { loggedIn, user, registered } = useAppSelector((state) => state.user);
	const { room } = useAppSelector((state) => state.room);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [expanded, setExpanded] = useState(false);

	const handleLogout = () => {
		dispatch(setLogOut());
		SignalRService.stopUserRoomConnection();
		toast.success("User logged out.");
		setShowUserMenu(false);
		navigate("/");
	};

	useEffect(() => {
		if (loggedIn) setShowLogin(false);
		if (registered) setShowRegister(false);
		if (room) setShowUserMenu(false);
	}, [loggedIn, registered, room])

	const handleClickNavBtn = (setFn: any) => {
		setFn(true);
		setExpanded(false);
	}

	return (
		<>
			<Navbar expand="lg" expanded={expanded} bg="light">
				<Container fluid>
					<div className="d-flex flex-row">
						<Col>
							<Image src="/logo/1.svg" roundedCircle style={{ height: "60px" }} />
						</Col>
						<Col className="d-flex flex-column align-items-center">
							<Navbar.Brand className="mx-0 py-0 px-3" as={RouterNavLink} to="/">SmartyParty</Navbar.Brand>
							<p style={{ fontSize: "10px", margin: 0, padding: 0, fontWeight: "bold", color: "purple" }}>AI Powered</p>
						</Col>
					</div>
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

					<Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(!expanded)} />
					<Navbar.Collapse id="navbar-nav">
						<Nav className="ms-auto">
							{!loggedIn ? (
								<div>
									<Button variant="outline-primary" className="m-2" onClick={() => handleClickNavBtn(setShowLogin)}>
										Login
									</Button>
									<Button variant="outline-success" onClick={() => handleClickNavBtn(setShowRegister)}>
										Register
									</Button>
								</div>
							) : (
								<Button variant="outline-dark" className="m-2" onClick={() => handleClickNavBtn(setShowUserMenu)}>
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
					<Accordion className="d-block d-md-none small">
						<Accordion.Item eventKey="0" >
							<Accordion.Header >Create Room</Accordion.Header>
							<Accordion.Body>
								<CreateRoomForm />
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					<Button variant="danger" className="w-100" onClick={handleLogout}>Log Out</Button>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	);
}
