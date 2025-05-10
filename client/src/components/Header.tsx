import { LoginForm } from "./LoginForm";
import { NavLink } from "react-router";
import { RegisterForm } from "./RegisterForm";

export default function Header() {
    return (

        <>
            <nav className="navbar bg-body-tertiary fixed-top">
                <div className="container-fluid d-flex justify-content-between">
                    <div>
                        <NavLink to="/" className="navbar-brand">SmartyParty</NavLink>
                    </div>
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
                    </div>
                </div>
            </nav >
        </>

    )
}
