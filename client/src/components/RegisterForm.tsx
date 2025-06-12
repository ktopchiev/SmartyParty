import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { toast } from "react-toastify";
import { useUserRegisterMutation } from "../services/user/userApi";
import type RegisterRequest from "../models/RegisterRequest";

import { Form, Button, Image } from "react-bootstrap";
import { useAppDispatch } from "../services/store";
import { setRegistered } from "../services/user/userSlice";

type FormData = {
    username: string;
    email: string;
    password: string;
};

type ServerError = {
    status: number;
    data: {
        message: string;
    };
};

export function RegisterForm() {
    const { register, handleSubmit, reset, setError, formState: { errors }, } = useForm<FormData>();
    const [userRegister] = useUserRegisterMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onSubmit = handleSubmit((data: FormData) => {
        const registerRequest: RegisterRequest = {
            userName: data.username,
            email: data.email,
            password: data.password,
        };

        userRegister(registerRequest)
            .unwrap()
            .then(() => {
                toast.success("User registered successfuly - please log in!");
                reset();
                dispatch(setRegistered(true));
                navigate("/");
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
                <Image
                    src="./images/Smarty_Shiba_Inu_Image_Yellow.png"
                    className="img-thumbnail rounded-circle mx-auto d-block"
                    style={{ width: "200px" }}
                    alt="login-img"
                />
            </div>
            <Form onSubmit={onSubmit} className="container mt-3" noValidate>
                <Form.Group controlId="registerUserName" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        aria-describedby="userNameHelp"
                        {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && (
                        <p className="small text-danger">{errors.username.message}</p>
                    )}
                </Form.Group>

                <Form.Group controlId="inputEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        aria-describedby="emailHelp"
                        {...register("email", {
                            required: "Email is required",
                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        })}
                    />
                    {errors.email && (
                        <p className="small text-danger">{errors.email.message}</p>
                    )}
                </Form.Group>

                <Form.Group controlId="registerPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && (
                        <p className="small text-danger">{errors.password.message}</p>
                    )}
                </Form.Group>

                <Button type="submit" className="btn btn-primary">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
