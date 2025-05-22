export default interface Room {
    id: string;
    name: string;
    creator: string;
    topic: string;
    status: string; // "Open" | "Locked"
    players: string[];
}