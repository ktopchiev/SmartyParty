import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

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
                await this.signalRConnection?.start();
                console.assert(this.signalRConnection?.state as HubConnectionState === HubConnectionState.Connected);
                console.log("SignalR connection started.");
            } catch (error) {
                console.assert(this.signalRConnection?.state === HubConnectionState.Disconnected);
                console.log(error);
            }
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