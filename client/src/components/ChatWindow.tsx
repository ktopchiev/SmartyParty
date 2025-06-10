// components/ChatWindow.tsx
import { useState } from "react";
import { useAppSelector } from "../services/store";
import SignalRService from "../services/signalR/SignalRService";
import type { MessageDto } from "../models/MessageDto";
import { HubConnectionState } from "@microsoft/signalr";

interface Props {
    roomId: string;
}

export default function ChatWindow({ roomId }: Props) {
    const [input, setInput] = useState("");
    const { room } = useAppSelector((state) => state.room);
    const { user } = useAppSelector((state) => state.user);

    const handleSend = async () => {

        if (input.trim()) {
            const messageDto: MessageDto = {
                roomId: roomId,
                from: user?.username!,
                content: input.trim(),
            };
            if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {

                await SignalRService.startUserRoomConnection();
            }
            await SignalRService.sendMessage(messageDto);
            setInput("");
        }
    };

    return (
        <div
            className="border-start ps-3"
            style={{ maxWidth: "300px", minHeight: "100%" }}
        >
            <h6 className="text-muted">Chat</h6>
            <div
                className="bg-white rounded p-2 mb-2"
                style={{ height: "60vh", overflowY: "auto" }}
            >
                {room?.messages?.map((msg) => (
                    <div
                        className={`container d-flex mb-2 ${msg.from === user?.username ? "justify-content-end" : "justify-content-start"}`}
                        style={{ wordWrap: "break-word", }}
                        key={msg.id}
                    >
                        <div
                            className={`small pb-1 mb-1 px-2 flex-end`}
                            style={{
                                backgroundColor: msg.from === user?.username ? " #3498db" : " #e5e7e9",
                                fontSize: 14,
                                color: msg.from === user?.username ? "white" : "black",
                                borderRadius: "25px",
                                fontWeight: "semi-bold",
                                maxWidth: "150px",
                                padding: "10px"
                            }}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <div className="d-flex">
                <input
                    type="text"
                    className="form-control form-control-sm me-1"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-sm btn-primary" onClick={handleSend}>Send</button>
            </div>
        </div >
    );
};
