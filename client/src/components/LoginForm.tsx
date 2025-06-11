import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useLoginMutation } from "../services/user/userApi";
import type { LoginRequest } from "../models/LoginRequest";
import { setCurrentUser } from "../services/user/userSlice";
import { useAppDispatch } from "../services/store";
import SignalRService from "../services/signalR/SignalRService";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { closeBsOffcanvas } from "../util/utilities";

import { Form, Button, InputGroup, Image } from "react-bootstrap";

type FormData = {
    username: string;
    password: string;
};

export function LoginForm() {
    const { register, handleSubmit, reset } = useForm<FormData>();
    const [login] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (data: FormData) => {
        try {
            const loginRequest: LoginRequest = {
                Username: data.username,
                Password: data.password,
            };

            const response = await login(loginRequest).unwrap();
            localStorage.setItem("user", JSON.stringify(response));
            dispatch(setCurrentUser(response));
            reset();
            await SignalRService.startUserRoomConnection();
            toast.success("User logged in successfully!");
            closeBsOffcanvas();
            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please check your credentials.");
        }
    };

    return (
        <div>
            <div className="text-center mb-3">
                <Image
                    src="./images/Smarty_Shiba_Inu_Image_Blue.png"
                    roundedCircle
                    fluid
                    style={{ width: "200px" }}
                    alt="login-img"
                />
            </div>

            <Form onSubmit={handleSubmit(handleLogin)} className="px-3">
                <Form.Group controlId="loginUserName" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        {...register("username", { required: true })}
                    />
                </Form.Group>

                <Form.Group controlId="loginPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            {...register("password", { required: true })}
                        />
                        <InputGroup.Text
                            role="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ cursor: "pointer" }}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </InputGroup.Text>
                    </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Submit
                </Button>
            </Form>
        </div>
    );
}
