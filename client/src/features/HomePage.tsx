import { useForm } from "react-hook-form";
import { useAppSelector } from "../services/store";
import { useEffect, useState } from "react";
import type Room from "../models/Room";
import SignalRService from "../services/signalR/SignalRService";
import { HubConnectionState } from "@microsoft/signalr";
import { useNavigate } from "react-router";

type FormData = {
    roomName: string;
    radio: string;
}

export default function HomePage() {
    const { loggedIn, user } = useAppSelector((state) => state.user);
    const { register, handleSubmit } = useForm<FormData>();
    const [rooms, setRooms] = useState<Room[] | null>(null);
    const navigate = useNavigate();

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

    const handleCreateRoom = async (data: FormData) => {
        event?.preventDefault();
        console.log(data);
        if (SignalRService.getSignalRConnection()?.state !== HubConnectionState.Connected) {
            await SignalRService.startUserRoomConnection();
        }
        await SignalRService.createRoom(user!.username, data.roomName, data.radio);
    }

    useEffect(() => {

        const waitForConnectionAndFetchRooms = async () => {
            const connection = SignalRService.getSignalRConnection();

            if (!connection) {
                console.error("SignalR connection not initialized.");
                return;
            }

            // // Wait until connection is connected
            // const waitUntilConnected = async () => {
            //     while (connection.state !== HubConnectionState.Connected) {
            //         console.log("Waiting for SignalR connection...");
            //         await new Promise(res => setTimeout(res, 100));
            //     }
            // };

            // await waitUntilConnected();

            if (connection.state === HubConnectionState.Connected) {
                const rooms = await SignalRService.getRooms();
                setRooms(rooms);
                console.log("Rooms:", rooms);
            }
        };

        waitForConnectionAndFetchRooms();
    }, []);

    useEffect(() => {
        SignalRService.setOnRoomCreatedCallback((room) => {
            console.log("Room created callback:", room);
            setRooms((prevRooms) => (prevRooms ? [...prevRooms, room] : [room]));
            navigate(`/room/${room.id}`);
        });
    }, [navigate]);

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-6">
                    <h2 className="text-center">Rooms</h2>
                    {!loggedIn ?
                        (<h5 className="text-center">Please log in to create or join rooms.</h5>)
                        :
                        (<table className="table table-striped table-hover table-sm">
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
                                {rooms?.map((room) => (
                                    <tr key={room.id}>
                                        <th scope="row">{room.id}</th>
                                        <td>{room.name}</td>
                                        <td>{room.creator}</td>
                                        <td>{room.topic}</td>
                                        <td>{room.status}</td>
                                        <td>
                                            <button className={`btn btn-primary ${loggedIn ?? 'disabled'}`} type="button">Join</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>)}
                </div>
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
                            <button type="button" className="btn btn-warning" onClick={() => console.log(SignalRService.getSignalRConnection()?.state)}>Check connection</button>

                        </form>
                    </div>
                )}

            </div>
        </div>
    )
}