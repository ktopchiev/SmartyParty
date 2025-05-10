import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import { toast } from "react-toastify";

type FormData = {
    username: string;
    password: string;
}

export function LoginForm() {
    const { register, handleSubmit } = useForm<FormData>();
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data: FormData) => {
        fetch("http://localhost:5255/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data);
                toast.success('You have been logged in successfully');
                const offcanvas = document.getElementById("offcanvasNavbarLogin");
                if (offcanvas) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
                navigate("/");
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Login failed - please try again');
            });
    });

    return (
        <div>
            <div>
                <img src="./images/Smarty_Shiba_Inu_Image_Blue.png" className="img-thumbnail rounded-circle mx-auto d-block" style={{ width: "200px" }} alt="login-img" />
            </div>
            <form onSubmit={onSubmit} className="container mt-3">
                <div className="mb-3">
                    <label htmlFor="inputUserName" className="form-label">Username</label>
                    <input type="username" className="form-control" id="inputUserName" aria-describedby="userNameHelp" {...register("username")} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputPassword" {...register("password")} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
