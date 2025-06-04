import { useForm } from "react-hook-form";
import { useAppSelector } from "../services/store";
import { useEffect } from "react";
import SignalRService from "../services/signalR/SignalRService";
import { HubConnectionState } from "@microsoft/signalr";
import { useNavigate } from "react-router";
import type Room from "../models/Room";

type FormData = {
    roomName: string;
    radio: string;
}

export default function HomePage() {
    const { loggedIn, user } = useAppSelector((state) => state.user);
    const { register, handleSubmit } = useForm<FormData>();
    const navigate = useNavigate();
    const { roomsList } = useAppSelector((state) => state.room);

    const topics = [
        { id: 1, name: "General Knowledge" },
        { id: 2, name: "Rock Music" },
        { id: 3, name: "Pets" },
        { id: 4, name: "Cinema" },
        { id: 5, name: "Literature" },
        { id: 6, name: "History" },
        { id: 7, name: "Science" },
        { id: 8, name: "Geography" },
        { id: 9, name: "Sports" },
        { id: 10, name: "Technology" }
    ];

    const handleJoinRoom = async (roomId: string) => {
        if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
            await SignalRService.startUserRoomConnection();
        }

        await SignalRService.joinRoom(roomId, user?.username!);
        navigate(`/quizroom/${roomId}`);
    }

    const handleCreateRoom = async (data: FormData) => {
        event?.preventDefault();
        if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
            await SignalRService.startUserRoomConnection();
        }
        await SignalRService.createRoom(user!.username, data.roomName, data.radio);
    }

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
    }, [navigate]);

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-6">
                    <h2 className="text-center">Rooms</h2>
                    {!loggedIn &&
                        (<h5 className="text-center mark">Please log in to create or join rooms.</h5>)
                    }
                    <table className="table table-striped table-hover table-sm">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Creator</th>
                                <th scope="col">Topic</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomsList?.map((room: Room) => (
                                <tr key={room.id}>
                                    <th scope="row">{room.id}</th>
                                    <td>{room.name}</td>
                                    <td>{room.creator}</td>
                                    <td>{room.topic}</td>
                                    <td>{room.status}</td>
                                    <td>
                                        <button
                                            className={`btn btn-warning ${!loggedIn || room.players.length === 2 ? "disabled" : ""}`}
                                            type="button"
                                            onClick={() => handleJoinRoom(room.id)}
                                        >
                                            Join
                                        </button >
                                    </td >
                                </tr >
                            ))}
                        </tbody >
                    </table >
                </div >
                {loggedIn && (
                    <div className="col-6">
                        <form onSubmit={handleSubmit(handleCreateRoom)} className="container mt-3">

                            <div className="mb-3">
                                <label htmlFor="roomName" className="form-label">Name</label>
                                <input type="text" className="form-control" id="roomName" {...register("roomName")} />
                            </div>

                            <div className="mb-3">
                                <h5>Topic</h5>
                                {topics.map((topic) => (
                                    <div className="form-check" key={topic.id}>
                                        <input className="form-check-input" {...register("radio")} type="radio" id={`radioDefault${topic.id}`} value={topic.name} />
                                        <label className="form-check-label" htmlFor={`radioDefault${topic.id}`}>
                                            {topic.name}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="btn btn-warning">Create New Room</button>

                        </form>
                    </div>
                )}

            </div >
        </div >
    )
}