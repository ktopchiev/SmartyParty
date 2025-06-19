import type { Player } from "./Player";

export type Message = {
    id: string;
    roomId: string;
    from: string;
    content: string;
}

export type Option = {
    id: number;
    content: string;
    isCorrect: boolean;
}

export type Question = {
    id: number;
    questionContent: string;
    options: Option[];
}

export default interface Room {
    id: string;
    name: string;
    creator: string;
    topic: string;
    language: string;
    status: string; // "Open" | "Locked"
    numberOfQuestions: number;
    difficulty: string;
    players: Player[] | [];
    messages: Message[];
    questions: Question[];
    allPlayersAnswered: boolean;
}