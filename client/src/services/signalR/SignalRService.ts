import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import type { PlayerDto } from "../../models/PlayerDto";

class SignalRService {

    private signalRConnection: HubConnection | null = null;
    private baseUrl: string = import.meta.env.VITE_APP_HUBS_URL;

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
        if (this.signalRConnection?.state === HubConnectionState.Disconnected) {

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
        }
    }

    public async createRoom(roomName: string, topic: string) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            return await this.signalRConnection?.invoke("CreateRoom", roomName, topic);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    }

    public async joinRoom(roomId: string, player: PlayerDto) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            return await this.signalRConnection?.invoke("JoinRoom", roomId, player);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    }

    public async leaveRoom(roomId: string, player: PlayerDto) {
        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        try {
            return await this.signalRConnection?.invoke("LeaveRoom", roomId, player);
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
            return await this.signalRConnection?.invoke("GetRooms");
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
            return await this.signalRConnection?.invoke("GetRoom", roomId);
        } catch (error) {
            console.error("Error getting room:", error);
        }
    }

    public stopUserRoomConnection() {

        if (!this.signalRConnection) {
            console.error("SignalR connection is not established.");
            return;
        }

        return this.signalRConnection?.stop()
            .then(() => {
                console.assert(this.signalRConnection?.state === HubConnectionState.Disconnected);
                this.signalRConnection = null;
                console.log("SignalR connection stopped.");
            })
            .catch(error => console.log(error));
    }
}

export default new SignalRService();