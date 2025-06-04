export type Message = {
    id: string;
    roomId: string;
    from: string;
    content: string;
}

export default interface Room {
    id: string;
    name: string;
    creator: string;
    topic: string;
    status: string; // "Open" | "Locked"
    players: string[];
    messages: Message[];
}