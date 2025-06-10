import type { FormData } from "../features/HomePage";

export interface RoomRequest {
    Username: string;
    RoomName: string;
    Topic: string;
    Language: string;
    Number: string;
    Difficulty: string;
}

export function ToRoomRequest(username: string, data: FormData): RoomRequest {
    return {
        Username: username,
        RoomName: data.roomName,
        Topic: data.topic,
        Language: data.language,
        Number: data.number,
        Difficulty: data.difficulty,
    }
}