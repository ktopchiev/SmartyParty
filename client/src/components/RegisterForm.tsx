import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { toast } from "react-toastify";
import { closeBsOffcanvas } from "../util/utilities";
import { useUserRegisterMutation } from "../services/user/userApi";
import type RegisterRequest from "../models/RegisterRequest";

type FormData = {
    username: string;
    email: string;
    password: string;
}

type ServerError = {
    status: number,
    data: {
        message: string,
    },
}

export function RegisterForm() {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormData>();
    const [userRegister] = useUserRegisterMutation();
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data: FormData) => {
        const registerRequest: RegisterRequest = {
            userName: data.username,
            email: data.email,
            password: data.password,
        }

        userRegister(registerRequest).unwrap()
            .then((res) => {
                toast.success("User registered successfuly - please log in!");
                reset();
                closeBsOffcanvas();
                navigate('/');
            })
            .catch((err: ServerError) => {
                handleApiErrors(err);
            });
    });

    function handleApiErrors(error: ServerError) {
        console.log(error);
        const msg = error.data.message;
        if (msg.includes("Username")) {
            setError("username", { message: msg });
        } else if (msg.includes("Email")) {
            setError("email", { message: msg });
        } else if (msg.includes("Password")) {
            setError("password", { message: msg });
        } else {
            toast.error(error.data.message);
        }
    }


    return (
        <div>
            <div>
                <img src="./images/Smarty_Shiba_Inu_Image_Yellow.png" className="img-thumbnail rounded-circle mx-auto d-block" style={{ width: "200px" }} alt="login-img" />
            </div>
            <form onSubmit={onSubmit} className="container mt-3" noValidate>
                <div className="mb-3">
                    <label htmlFor="registerUserName" className="form-label">Username</label>
                    <input type="username" className="form-control" id="registerUserName" aria-describedby="userNameHelp" {...register("username", { required: "Username is required" })} />
                    {errors.username && <p className="small text-danger">{errors.username.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" {...register("email", { required: "Email is required", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })} />
                    {errors.email && <p className="small text-danger">{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                    <label htmlFor="registerPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="registerPassword" {...register("password", { required: "Password is required" })} />
                    {errors.password && <p className="small text-danger">{errors.password.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
