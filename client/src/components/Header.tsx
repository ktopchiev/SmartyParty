import { LoginForm } from "./LoginForm";
import { NavLink, useNavigate } from "react-router";
import { RegisterForm } from "./RegisterForm";
import { useAppDispatch, useAppSelector } from "../services/store";
import { setLogOut } from "../services/user/userSlice";
import SignalRService from "../services/signalR/SignalRService";

export default function Header() {

    const { loggedIn, user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(setLogOut());
        SignalRService.stopUserRoomConnection();
        navigate("/");
    }

    return (

        <>
            <nav className="navbar bg-body-secondary" style={{ zIndex: 1000 }}>
                <div className="container-fluid d-flex justify-content-between">
                    <div>
                        <NavLink to="/" className="navbar-brand">SmartyParty</NavLink>
                    </div>
                    {!loggedIn ? (
                        <div>
                            <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbarLogin" aria-controls="offcanvasNavbarLogin" aria-label="Toggle navigation">
                                Login
                            </button>
                            <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbarRegister" aria-controls="offcanvasNavbarRegister" aria-label="Toggle navigation">
                                Register
                            </button>

                            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbarLogin" aria-labelledby="offcanvasNavbarLoginLabel">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title" id="offcanvasNavbarLoginLabel">Login</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <LoginForm />
                                </div>
                            </div>
                            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbarRegister" aria-labelledby="offcanvasNavbarRegisterLabel">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title" id="offcanvasNavbarRegisterLabel">Register</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <RegisterForm />
                                </div>
                            </div>
                        </div>) : (
                        <div>
                            <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbarUser" aria-controls="offcanvasNavbarUser" aria-label="Toggle navigation">
                                {user?.username}
                            </button>
                            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbarUser" aria-labelledby="offcanvasNavbarUserLabel">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title" id="offcanvasNavbarUserLabel">{user?.email}</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <div className="d-flex flex-column gap-2">
                                        <button className="btn btn-primary outlined">Profile</button>
                                        <button className="btn btn-primary" onClick={handleLogout}>Log Out</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav >
        </>

    )
}

