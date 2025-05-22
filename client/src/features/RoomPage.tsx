import { useParams } from "react-router";
import QuizCard from "../components/QuizCard";
import SignalRService from "../services/signalR/SignalRService";
import { useEffect, useState } from "react";
import type Room from "../models/Room";

export default function RoomPage() {

    const { roomId } = useParams();
    const [room, setRoom] = useState<Room | null>(null);

    useEffect(() => {
        const fetchRoomData = async () => {
            SignalRService.getRoomById(roomId!)
                .then((room) => {
                    console.log("Room data:", room);
                    setRoom(room);
                })
                .catch((error) => {
                    console.error("Error fetching room data:", error);
                });
        }
        fetchRoomData();
    }, []);

    return (
        <div className="container mt-1">
            <QuizCard
                room={room}
            />
        </div>
    )
}
