import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { store } from "../store";
import type Room from "../../models/Room";
import { addMessageToRoom, addPlayer, addRoomToList, removePlayer, resetRoom, setRoom, setRoomsList } from "./roomsSlice";
import type { MessageDto } from "../../models/MessageDto";

class SignalRService {

    private signalRConnection: HubConnection | null = null;
    private baseUrl: string = import.meta.env.VITE_APP_HUBS_URL;
    private onRoomCreatedCallback: ((room: Room) => void) | null = null;

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

        this.signalRConnection?.on("PlayerJoined", (player) => {
            console.log(`Player <${player}> joined the room`);
            store.dispatch(addPlayer(player));
        });

        this.signalRConnection?.on("PlayerLeft", (player) => {
            console.log(`Player <${player}> left the room`)
            store.dispatch(removePlayer(player));
            if (store.getState().room.room?.players.length === 0) {
                store.dispatch(resetRoom());
            }
        });

        this.signalRConnection?.on("ReceiveRoomList", (rooms) => {
            console.log("Rooms list received:", rooms);
            store.dispatch(setRoomsList(rooms));
        });

        this.signalRConnection?.on("ReceiveRoom", (room) => {
            console.log("Room received:", room);
            store.dispatch(setRoom(room));
            store.dispatch(addRoomToList(room));
        });
    }


    public setOnRoomCreatedCallback(callback: (room: Room) => void) {
        this.onRoomCreatedCallback = callback;
    }

    public async createRoom(username: string, roomName: string, topic: string) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            console.log("Creating room with name:", roomName, "and topic:", topic);
            if (!roomName || !topic) {
                console.error("Room name and topic are required to create a room.");
                return;
            }
            let roomResponse = await this.signalRConnection?.invoke("CreateRoom", username, roomName, topic);
            console.log("Room created successfully:", roomResponse);
            return roomResponse;
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