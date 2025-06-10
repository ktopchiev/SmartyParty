import { useForm } from "react-hook-form";
import { useAppSelector } from "../services/store";
import { useEffect, useState } from "react";
import SignalRService from "../services/signalR/SignalRService";
import { HubConnectionState } from "@microsoft/signalr";
import { useNavigate } from "react-router";
import type Room from "../models/Room";
import { ToRoomRequest } from "../models/RoomRequest";
import { toast } from "react-toastify";

export type FormData = {
    roomName: string;
    topic: string;
    language: string;
    number: string;
    difficulty: string;
}

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
        // Table for list of active rooms
        <div className="container d-flex flex-row justify-content-evenly mt-3">
            <div className="container">
                <h2 className="text-center">Rooms</h2>
                {!loggedIn &&
                    (<h5 className="text-center mark">Please log in to create or join rooms.</h5>)
                }
                <table className="table table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Creator</th>
                            <th scope="col">Topic</th>
                            <th scope="col">Status</th>
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
                                    <button
                                        className={`btn btn-warning mx-2`}
                                        type="button"
                                        onClick={() => handleJoinRoom(room.id)}
                                        disabled={!loggedIn || room.players.length >= 2}
                                    >
                                        Join
                                    </button >
                                    {user?.username === "admin" &&
                                        (< button
                                            className={`btn btn-danger`}
                                            type="button"
                                            onClick={() => handleRemoveRoom(room.id)}
                                        >
                                            Remove
                                        </button >
                                        )}
                                </td >
                            </tr >
                        ))}
                    </tbody >
                </table >
            </div >

            {/* Form for creating a room */}
            {loggedIn && (
                <div className="container d-flex flex-column" style={{ maxWidth: 600, margin: 0 }}>
                    <form className="needs-validation" noValidate onSubmit={handleSubmit(handleCreateRoom)}>

                        <div className="mb-3">
                            <label htmlFor="roomName" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="roomName"
                                placeholder="Enter room name..."
                                aria-invalid={errors.roomName ? "true" : "false"}
                                {...register("roomName", { required: "Room name is required" })}
                            />
                            {errors.roomName && <p className="small text-danger" role="alert">{errors.roomName.message}</p>}
                        </div>

                        <div className="container d-flex justify-content-center">
                            <div className="container d-flex flex-column mb-1 justify-content-center">
                                <h5>Topic</h5>
                                {topics.map((topic) => (
                                    <div className="form-check"
                                        key={topic.id}
                                        aria-invalid={errors.topic ? "true" : "false"}
                                    >
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id={`radioDefault${topic.id}`}
                                            value={topic.name}
                                            {...register("topic", { required: "Quiz topic is required" })}
                                        />
                                        <label className="form-check-label small" htmlFor={`radioDefault${topic.id}`}>
                                            {topic.name}
                                        </label>
                                    </div>
                                ))}

                            </div>
                            <div className="container d-flex flex-column mb-3 justify-content-start">
                                <select className="form-select form-select-sm mb-2" aria-label="Select language" defaultValue={"english"} {...register("language")}>
                                    <option value={"Select language"} disabled>Select language</option>
                                    {languages.map((lng) =>
                                        <option key={lng.id} value={lng.language}>{lng.language}</option>
                                    )}
                                </select>
                                <select className="form-select form-select-sm mb-2" aria-label="Select question number" defaultValue={"5"} {...register("number")}>
                                    <option value={"Select number"} disabled>Select number</option>
                                    {questionNumbers.map((num) =>
                                        <option key={num.id} value={num.num}>{num.num}</option>
                                    )}
                                </select>
                                <select className="form-select form-select-sm mb-2" aria-label="Select difficulty" defaultValue={"normal"} {...register("difficulty")}>
                                    <option value={"Select difficulty"} disabled>Select difficulty</option>
                                    {difficulties.map((diff) =>
                                        <option key={diff.id} value={diff.level}>{diff.level}</option>
                                    )}
                                </select>
                                {errors.topic && <p className="small text-danger" role="alert">{errors.topic.message}</p>}
                            </div>
                        </div>
                        {isLoading ?
                            (<button className="btn btn-primary" type="button" disabled>
                                <span className="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                                <span role="status">Creating Room...</span>
                            </button>
                            ) : (
                                < button type="submit" className="btn btn-warning">Create New Room</button>
                            )}

                    </form>
                </div>
            )}

        </div >
    )
}