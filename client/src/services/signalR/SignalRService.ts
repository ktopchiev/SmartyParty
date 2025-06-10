import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { store } from "../store";
import type Room from "../../models/Room";
import { addMessageToRoom, addPlayer, addRoomToList, removePlayer, removeRoom, setCurrentAnswer, setQuestionIndex, setRoom, setRoomsList, updatePlayer } from "../room/roomsSlice";
import type { MessageDto } from "../../models/MessageDto";
import type { RoomRequest } from "../../models/RoomRequest";
import type { Message } from "../../models/Room";
import { toast } from "react-toastify";
import type { Player } from "../../models/Player";
import type Answer from "../../models/Answer";

class SignalRService {

    private signalRConnection: HubConnection | null = null;
    private baseUrl: string = import.meta.env.VITE_APP_HUBS_URL;
    private onRoomCreatedCallback: ((room: Room) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;

    constructor() {
        console.log("Creating SignalR connection...");
        this.signalRConnection = new HubConnectionBuilder()
            .withUrl(`${this.baseUrl}connectionuser`)
            .configureLogging("Information")
            .withAutomaticReconnect()
            .build();
    }

    public getSignalRConnection() {

        if (this.signalRConnection) {
            return this.signalRConnection;
        } else {
            console.error("SignalR connection is not established.");
            return null;
        }
    }

    public async startUserRoomConnection() {
        if (this.signalRConnection?.state === HubConnectionState.Connected) return;

        this.signalRConnection?.on("UserConnected", () => {
            console.log("Server called here");
        });

        try {
            await this.signalRConnection?.start().catch((error) => console.error(error));
            console.assert(this.signalRConnection?.state as HubConnectionState === HubConnectionState.Connected);
            console.log("SignalR connection started.");
        } catch (error) {
            console.assert(this.signalRConnection?.state === HubConnectionState.Disconnected);
            console.log(error);
        }

        this.signalRConnection?.on("RoomCreated", (room) => {
            console.log("Room created:", room);
            if (this.onRoomCreatedCallback) {
                this.onRoomCreatedCallback(room);
            }
        });

        this.signalRConnection?.on("ReceiveMessage", (message) => {
            console.log("Message received:", message);
            store.dispatch(addMessageToRoom(message));
        });

        this.signalRConnection?.on("PlayerJoined", (player: Player) => {
            let msg: Message = {
                roomId: "",
                id: "",
                from: "",
                content: `Player <${player.username}> joined the room`,
            };
            console.log(msg.content);
            store.dispatch(addPlayer(player));
            store.dispatch(addMessageToRoom(msg));
        });

        this.signalRConnection?.on("PlayerUpdated", (player: Player) => {
            console.log("PlayerUpdated", player);
            store.dispatch(updatePlayer(player));
            store.dispatch(setQuestionIndex(player.currentQuestionIndex));
        });

        this.signalRConnection?.on("PlayerLeft", (player: Player) => {
            let msg: Message = {
                roomId: "",
                id: "",
                from: "system",
                content: `Player <${player.username}> has left the room`,
            };
            console.log(msg.content);
            store.dispatch(removePlayer(player));
            store.dispatch(addMessageToRoom(msg));
            const room = store.getState().room.room;
            if (room?.players.length === 0) {
                store.dispatch(removeRoom(room.id));
            }
        });

        this.signalRConnection?.on("ReceiveRoomList", (rooms) => {
            console.log("Rooms list received:", rooms);
            store.dispatch(setRoomsList(rooms));
        });

        this.signalRConnection?.on("ReceiveRoom", (room: Room) => {
            console.log("Room received:", room);
            store.dispatch(setRoom(room));
            store.dispatch(addRoomToList(room));
        });

        this.signalRConnection?.on("RemoveRoom", (roomId) => {
            console.log("Room removed:", roomId);
            store.dispatch(removeRoom(roomId));
        });

        this.signalRConnection?.on("ReceiveAnswer", (answer: Answer) => {
            console.log("Answer received:", answer);
            store.dispatch(setCurrentAnswer(answer));
        });

        this.signalRConnection?.on("HandleError", (error: "string") => {
            this.onErrorCallback?.(error);
        });

        this.signalRConnection?.on("AccessDenied", (message: string) => {
            console.error(message);
            toast.warning(message);
            window.location.href = "/";
        });
    }


    public setOnRoomCreatedCallback(callback: (room: Room) => void) {
        this.onRoomCreatedCallback = callback;
    }

    public setOnErrorCallback(callback: (error: string) => void) {
        this.onErrorCallback = callback;
    }

    public async createRoom(roomRequest: RoomRequest) {
        const roomName = roomRequest.RoomName;
        const topic = roomRequest.Topic;

        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            console.log("Creating room with name:", roomName, "and topic:", topic);
            if (!roomName || !topic) {
                let errMsg = "Room name and topic are required to create a room.";
                console.error(errMsg);
                return;
            }
            console.log("Room request", roomRequest);
            let roomResponse = await this.signalRConnection?.invoke("CreateRoom", roomRequest);
            console.log("Room created successfully:", roomResponse);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    }

    public async joinRoom(roomId: string, username: string) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            await this.signalRConnection?.invoke("JoinRoom", roomId, username);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    }


    public async leaveRoom(roomId: string, player: string) {
        try {
            await this.signalRConnection?.invoke("LeaveRoom", roomId, player);
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    }

    public async getRooms() {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            await this.signalRConnection?.invoke("GetRooms");
        } catch (error) {
            console.error("Error getting rooms:", error);
        }
    }

    public async getRoomById(roomId: string) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            await this.signalRConnection?.invoke("GetRoomById", roomId);
        } catch (error: any) {
            this.onErrorCallback?.(error.message || "Unknown error");
        }
    }

    public async updatePlayer(roomId: string, player: Player) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            console.log("updatePlayer", player);
            await this.signalRConnection?.invoke("UpdatePlayer", roomId, player);
        } catch (error: any) {
            this.onErrorCallback?.(error.message || "Unknown error");
        }
    }

    public async removeRoom(roomId: string) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            await this.signalRConnection?.invoke("RemoveRoom", roomId);
        } catch (error) {
            console.error("Error getting room:", error);
        }

    }

    public async sendMessage(message: MessageDto) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }
        try {
            console.log("Sending message to room:", message.roomId, "ConnectionId:", this.signalRConnection.connectionId, "Message:", message.content);
            await this.signalRConnection?.invoke("SendMessage", message);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    public async sendAnswer(answer: Answer) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }
        try {
            console.log("Sending answer to other user:", answer.id, "ConnectionId:", this.signalRConnection.connectionId, "Answer:", answer.option.content);
            await this.signalRConnection?.invoke("SendAnswer", answer);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    public stopUserRoomConnection() {

        if (this.signalRConnection) {

            return this.signalRConnection?.stop()
                .then(() => {
                    console.assert(this.signalRConnection?.state === HubConnectionState.Disconnected);
                    this.signalRConnection = null;
                    console.log("SignalR connection stopped.");
                })
                .catch(error => console.log(error));
        }
    }
}

export default new SignalRService();