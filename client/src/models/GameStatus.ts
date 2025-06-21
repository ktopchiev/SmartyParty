export interface GameStatus {
  roomId: string;
  status: "init" | "start" | "stop" | "finale";
}