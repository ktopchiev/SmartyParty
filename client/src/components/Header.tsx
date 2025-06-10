import { LoginForm } from "./LoginForm";
import { NavLink, useNavigate } from "react-router";
import { RegisterForm } from "./RegisterForm";
import { useAppDispatch, useAppSelector } from "../services/store";
import { setLogOut } from "../services/user/userSlice";
import SignalRService from "../services/signalR/SignalRService";
import { closeBsOffcanvas } from "../util/utilities";
import { toast } from "react-toastify";

export default function Header() {

    const { loggedIn, user } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(setLogOut());
        SignalRService.stopUserRoomConnection();
        toast.success("User logged out.")
        closeBsOffcanvas();
        navigate("/");
    }

    return (
        <>
            <nav className="navbar bg-body-secondary" style={{ zIndex: 1000 }}>
                <div className="container-fluid d-flex justify-content-between">
                    <div>
                        <NavLink to="/" className="navbar-brand">SmartyParty</NavLink>

                        {/* Button for developer purposes */}
                        <button type="button" className="btn btn-sm btn-warning" onClick={() =>
                            console.log({
                                state: SignalRService.getSignalRConnection()?.state,
                                id: SignalRService.getSignalRConnection()?.connectionId
                            })
                        }>
                            Check connection
                        </button>

                    </div>

                    {/* Login and Register offcanvas */}
                    {!loggedIn ? (

                        <div>
                            <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLogin" aria-controls="offcanvasLogin" aria-label="Toggle navigation">
                                Login
                            </button>

                            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="offcanvasLogin" aria-labelledby="offcanvasLoginLabel">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title" id="offcanvasLoginLabel">Login</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <LoginForm />
                                </div>
                            </div>

                            <button className="btn" type="button" data-bs-backdrop="static" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRegister" aria-controls="offcanvasRegister" aria-label="Toggle navigation">
                                Register
                            </button>

                            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRegister" aria-labelledby="offcanvasRegisterLabel">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title" id="offcanvasRegisterLabel">Register</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <RegisterForm />
                                </div>
                            </div>

                        </div>) : (

                        // Logged user menu
                        <div>
                            <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasUser" aria-controls="offcanvasUser" aria-label="Toggle navigation">
                                {user?.username}
                            </button>
                            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasUser" aria-labelledby="offcanvasUserLabel">
                                <div className="offcanvas-header">
                                    <h5 className="offcanvas-title" id="offcanvasUserLabel">{user?.email}</h5>
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

