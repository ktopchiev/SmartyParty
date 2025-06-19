import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { store } from "../store";
import type Room from "../../models/Room";
import { addMessageToRoom, addPlayer, addRoomToList, removePlayer, removeRoom, setCurrentAnswer, setGameStatus, setQuestionIndex, setRoom, setRoomsList, updatePlayer } from "../room/roomsSlice";
import type { MessageDto } from "../../models/MessageDto";
import type { RoomRequest } from "../../models/RoomRequest";
import type { Message } from "../../models/Room";
import { toast } from "react-toastify";
import type { Player } from "../../models/Player";
import type Answer from "../../models/Answer";
import type { GameStatus } from "../../models/GameStatus";

class SignalRService {

    private signalRConnection: HubConnection | null = null;
    private baseUrl: string = import.meta.env.VITE_APP_HUBS_URL;
    private onRoomCreatedCallback: ((room: Room) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;

    constructor() {
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
            await this.signalRConnection?.start();
            console.log("SignalR connection started.");
        } catch (error) {
            console.log(error);
        }

        this.signalRConnection?.onclose(async () => {
            console.warn("SignalR disconnected, trying to reconnect...");
            try {
                await this.signalRConnection?.start();
                console.log("Reconnected to SignalR.");
            } catch (err) {
                console.error("Reconnection failed:", err);
            }
        });

        this.signalRConnection?.on("RoomCreated", (room) => {
            if (this.onRoomCreatedCallback) {
                this.onRoomCreatedCallback(room);
            }
        });

        this.signalRConnection?.on("ReceiveMessage", (message) => {
            store.dispatch(addMessageToRoom(message));
        });

        this.signalRConnection?.on("PlayerJoined", (player: Player) => {
            console.log("Player joined")
            let msg: Message = {
                roomId: "",
                id: "",
                from: "",
                content: `Player <${player.username}> joined the room`,
            };
            store.dispatch(addPlayer(player));
            store.dispatch(addMessageToRoom(msg));
        });

        this.signalRConnection?.on("PlayerUpdated", (player: Player) => {
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
            store.dispatch(removePlayer(player));
            store.dispatch(addMessageToRoom(msg));
            const room = store.getState().room.room;
            if (room?.players.length === 0) {
                store.dispatch(removeRoom(room.id));
            }
        });

        this.signalRConnection?.on("ReceiveRoomList", (rooms) => {
            store.dispatch(setRoomsList(rooms));
        });

        this.signalRConnection?.on("ReceiveRoom", (room: Room) => {
            store.dispatch(setRoom(room));
            store.dispatch(addRoomToList(room));
        });

        this.signalRConnection?.on("RemoveRoom", (roomId) => {
            store.dispatch(removeRoom(roomId));
        });

        this.signalRConnection?.on("ReceiveAnswer", (answer: Answer) => {
            store.dispatch(setCurrentAnswer(answer));
        });

        this.signalRConnection?.on("ReceiveGameStatus", (status: "init" | "start" | "stop") => {
            store.dispatch(setGameStatus(status));
        });

        this.signalRConnection?.on("HandleError", (error: string) => {
            this.onErrorCallback?.(error);
        });

        this.signalRConnection?.on("AccessDenied", (message: string) => {
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
            await this.signalRConnection?.invoke("CreateRoom", roomRequest);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    }

    public async joinRoom(roomId: string, username: string) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }
        console.log("SignalR", "joinRoom");
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

        if (this.signalRConnection.state !== HubConnectionState.Connected) {
            console.warn("Connection is not in 'Connected' state, current:", this.signalRConnection.state);
            return;
        }


        try {
            await this.signalRConnection?.invoke("GetRooms");
        } catch (error: any) {
            console.error("Error invoking 'GetRooms':", error.message, error);
        }
    }

    public async getRoom(roomId: string, player: string) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            await this.signalRConnection?.invoke("GetRoom", roomId, player);
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

    public async sendGameStatus(status: GameStatus) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }
        try {
            console.log("Sending status to other user:", "Status:", status.status);
            await this.signalRConnection?.invoke("SendGameStatus", status);
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