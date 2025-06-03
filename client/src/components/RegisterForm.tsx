import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { toast } from "react-toastify";
import { closeBsOffcanvas } from "../util/utility";

type FormData = {
    username: string;
    email: string;
    password: string;
}

export function RegisterForm() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>();
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data: FormData) => {
        fetch("http://localhost:5255/api/user/register", {
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
                return response;
            })
            .then((data) => {
                console.log("Success:", data);
                toast.success('Registration have been successful - you can login now');
                closeBsOffcanvas();
                navigate("/");
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error('Registration failed - please try again');
                handleApiErrors(error);
            });
    });

    function handleApiErrors(errors: any) {
        console.log(errors);
        if (errors && errors.length > 0) {
            errors.forEach((error: string) => {
                if (error.includes("Username")) {
                    setError("username", { message: error });
                } else if (error.includes("Email")) {
                    setError("email", { message: error });
                } else if (error.includes("Password")) {
                    setError("password", { message: error });
                }
            });
        }
    }

    return (
        <div>
            <div>
                <img src="./images/Smarty_Shiba_Inu_Image_Yellow.png" className="img-thumbnail rounded-circle mx-auto d-block" style={{ width: "200px" }} alt="login-img" />
            </div>
            <form onSubmit={onSubmit} className="container mt-3">
                <div className="mb-3">
                    <label htmlFor="registerUserName" className="form-label">Username</label>
                    <input type="username" className="form-control" id="registerUserName" aria-describedby="userNameHelp" {...register("username", { required: "Username is required" })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" {...register("email", { required: "Email is required", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })} />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="registerPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="registerPassword" {...register("password", { required: "Password is required" })} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
