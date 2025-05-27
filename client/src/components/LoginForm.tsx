import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { toast } from "react-toastify";
import { useLoginMutation } from "../services/user/userApi";
import type { LoginModel } from "../models/LoginModel";
import { setCurrentUser } from "../services/user/userSlice";
import { useAppDispatch } from "../services/store";
import SignalRService from "../services/signalR/SignalRService";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

type FormData = {
    username: string;
    password: string;
}

export function LoginForm() {

    const { register, handleSubmit } = useForm<FormData>();
    const [login] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (data: FormData) => {

        event?.preventDefault();

        const loginModel: LoginModel = {
            Username: data.username,
            Password: data.password,
        }

        try {
            const response = await login(loginModel).unwrap();
            localStorage.setItem("user", JSON.stringify(response));
            dispatch(setCurrentUser(response));
            await SignalRService.startUserRoomConnection();
            toast.success("User logged in successfuly!");
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div>
                <img
                    src="./images/Smarty_Shiba_Inu_Image_Blue.png"
                    className="img-thumbnail rounded-circle mx-auto d-block"
                    style={{ width: "200px" }}
                    alt="login-img"
                />
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="container mt-3">
                <div className="mb-3">
                    <label htmlFor="inputUserName" className="form-label">
                        Username
                    </label>
                    <input
                        type="username"
                        className="form-control"
                        id="inputUserName"
                        aria-describedby="userNameHelp"
                        {...register("username")}
                    />
                </div>

                <div className="mb-3 position-relative">
                    <label htmlFor="inputPassword" className="form-label">
                        Password
                    </label>
                    <div className="d-flex align-items-center position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="inputPassword"
                            {...register("password")}
                        />
                        <span
                            className="position-absolute end-0 me-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    )
}
