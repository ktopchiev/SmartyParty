import { useEffect, useState } from "react";
import SignalRService from "../services/signalR/SignalRService";

export function useRoomTimer(roomId: string, autoStart = false, duration = 30) {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const connection = SignalRService.getSignalRConnection();
    if (!connection) return;

    const handleTick = (seconds: number) => {
      setTimeLeft(seconds);
    };

    const handleEnd = () => {
      setHasEnded(true);
      setTimeLeft(0);
    };

    connection.on("UpdateTimer", handleTick);
    connection.on("TimerEnded", handleEnd);

    if (autoStart) {
      SignalRService.startTimer(roomId, duration);
    }

    return () => {
      connection.off("UpdateTimer", handleTick);
      connection.off("TimerEnded", handleEnd);
    };
  }, [roomId, autoStart, duration]);

  const startTimer = async (seconds: number) => {
    await SignalRService.startTimer(roomId, seconds);
  };

  return {
    timeLeft,
    hasEnded,
    startTimer,
  };
}