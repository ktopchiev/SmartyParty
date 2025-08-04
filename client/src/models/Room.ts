import type Answer from "./Answer";
import type { GameStatus } from "./GameStatus";
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

/**
 * Interface to handle Room state
 * 
 * @id {string} room id
 * @name {string} room's name
 * @creator {string} room's creator name
 * @topic {string} room's topic
 * @landuage {string} questions language
 * @status {string} room's availability status
 * @numberOfQuestions {number} prop for room's questions number
 * @difficulty {string} prop for game's difficulty
 * @players {Player[]} prop is used for list the players in the room
 * @messages {Message[]} prop for room's messages
 * @questions {Question[]} prop for game's questions
 * @allPlayersAnswered {boolean} prop to indicate whether all players answered the current question or not
 * @questionIndex {number} prop for current question index
 * @gameStatus {GameStatus["status"]} prop for game status
 * @availability {string} prop for room's availability
 * @currentAnswer {Answer | null} prop for current answer
 * @unreadMessages {number} prop for room chat's unread messages
 */

export default interface Room {
    id: string;
    name: string;
    creator: string;
    topic: string;
    language: string;
    status: string; // "Open" | "Locked"
    numberOfQuestions: number;
    difficulty: string;
    /** A list of all players in the room */
    players: Player[];
    messages: Message[];
    questions: Question[];
    allPlayersAnswered: boolean;
    questionIndex: number;
    gameStatus: GameStatus["status"];
    availability: 'open' | 'closed';
    currentAnswer: Answer | null;
    unreadMessages: number;
}