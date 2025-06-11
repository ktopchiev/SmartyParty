import { useForm } from "react-hook-form";
import { useAppSelector } from "../services/store";
import { useEffect, useState } from "react";
import SignalRService from "../services/signalR/SignalRService";
import { HubConnectionState } from "@microsoft/signalr";
import { useNavigate } from "react-router";
import type Room from "../models/Room";
import { ToRoomRequest } from "../models/RoomRequest";
import { toast } from "react-toastify";

import { Container, Row, Col, Table, Button, Form, Spinner } from "react-bootstrap";

export type FormData = {
    roomName: string;
    topic: string;
    language: string;
    number: string;
    difficulty: string;
};

export default function HomePage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { loggedIn, user } = useAppSelector((state) => state.user);
    const { roomsList } = useAppSelector((state) => state.room);
    const navigate = useNavigate();

    const topics = [
        { id: 1, name: "General Knowledge" },
        { id: 2, name: "Rock and Metal Music" },
        { id: 3, name: "Pets" },
        { id: 4, name: "Cinema" },
        { id: 5, name: "Literature" },
        { id: 6, name: "World History" },
        { id: 9, name: "Bulgarian History" },
        { id: 7, name: "Science" },
        { id: 8, name: "Geography" },
        { id: 10, name: "Technology" },
        { id: 11, name: "C# and .NET" },
        { id: 12, name: "ReactJS" },
        { id: 13, name: "OOP" },
        { id: 14, name: "Design Patterns" },
        { id: 15, name: "Databases" },
    ];

    const languages = [
        { id: 1, language: "български" },
        { id: 2, language: "english" },
    ]

    const questionNumbers = [
        { id: 1, num: "5" },
        { id: 2, num: "10" },
        { id: 3, num: "20" },
    ]

    const difficulties = [
        { id: 1, level: "easy" },
        { id: 2, level: "normal" },
        { id: 3, level: "hard" },
        { id: 4, level: "expert" },
    ]

    useEffect(() => {

        const fetchAndSetRooms = async () => {
            if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
                await SignalRService.startUserRoomConnection();
            }

            await SignalRService.getRooms();
        }

        fetchAndSetRooms();

    }, []);

    useEffect(() => {

        SignalRService.setOnRoomCreatedCallback((room) => {
            console.log("Room created callback:", room);
            navigate(`/quizroom/${room.id}`);
        });

    }, []);

    const handleCreateRoom = async (data: FormData) => {
        event?.preventDefault();
        setIsLoading(true);
        if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
            await SignalRService.startUserRoomConnection();
        }

        let roomRequest = ToRoomRequest(user?.username!, data);
        try {
            await SignalRService.createRoom(roomRequest);
        } catch (error: any) {
            toast.error(error.message);
        }
        setIsLoading(false);
    }

    const handleJoinRoom = async (roomId: string) => {
        if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
            await SignalRService.startUserRoomConnection();
        }

        await SignalRService.joinRoom(roomId, user?.username!);
        navigate(`/quizroom/${roomId}`);
    }

    // Clean up a room and remove it from the list - Only available for admins
    const handleRemoveRoom = async (roomId: string) => {
        if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
            await SignalRService.startUserRoomConnection();
        }
        await SignalRService.removeRoom(roomId);
    }

    return (
        <Container className="mt-3 d-flex justify-content-evenly">
            <div>
                <h2 className="text-center">Rooms</h2>
                {!loggedIn && <h5 className="text-center mark">Please log in to create or join rooms.</h5>}
                <Table striped hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Creator</th>
                            <th>Topic</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomsList?.map((room: Room) => (
                            <tr key={room.id}>
                                <td>{room.name}</td>
                                <td>{room.creator}</td>
                                <td>{room.topic}</td>
                                <td>{room.status}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="mx-2"
                                        size="sm"
                                        onClick={() => handleJoinRoom(room.id)}
                                        disabled={!loggedIn || room.players.length >= 2}
                                    >
                                        Join
                                    </Button>
                                    {user?.username === "admin" && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveRoom(room.id)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {loggedIn && (
                <div style={{ maxWidth: 600 }}>
                    <Form noValidate onSubmit={handleSubmit(handleCreateRoom)}>
                        <Form.Group className="mb-3" controlId="roomName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter room name..."
                                isInvalid={!!errors.roomName}
                                {...register("roomName", { required: "Room name is required" })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.roomName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="mb-3">
                            <Col>
                                <h5>Topic</h5>
                                {topics.map((topic) => (
                                    <Form.Check
                                        key={topic.id}
                                        type="radio"
                                        label={topic.name}
                                        id={`radioDefault${topic.id}`}
                                        value={topic.name}
                                        isInvalid={!!errors.topic}
                                        {...register("topic", { required: "Quiz topic is required" })}
                                        name="topic"
                                    />
                                ))}
                                <Form.Control.Feedback type="invalid" style={{ display: errors.topic ? "block" : "none" }}>
                                    {errors.topic?.message}
                                </Form.Control.Feedback>
                            </Col>

                            <Col>
                                <Form.Select {...register("language")} defaultValue="english" className="mb-2">
                                    <option disabled value="Select language">Select language</option>
                                    {languages.map(lng => (
                                        <option key={lng.id} value={lng.language}>{lng.language}</option>
                                    ))}
                                </Form.Select>
                                <Form.Select {...register("number")} defaultValue="5" className="mb-2">
                                    <option disabled value="Select number">Select number</option>
                                    {questionNumbers.map(num => (
                                        <option key={num.id} value={num.num}>{num.num}</option>
                                    ))}
                                </Form.Select>
                                <Form.Select {...register("difficulty")} defaultValue="normal" className="mb-2">
                                    <option disabled value="Select difficulty">Select difficulty</option>
                                    {difficulties.map(diff => (
                                        <option key={diff.id} value={diff.level}>{diff.level}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>

                        {isLoading ? (
                            <Button variant="primary" disabled>
                                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                {' '}Creating Room...
                            </Button>
                        ) : (
                            <Button variant="warning" type="submit">Create New Room</Button>
                        )}
                    </Form>
                </div>
            )}
        </Container>
    );
}