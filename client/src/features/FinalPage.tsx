import { useAppSelector } from "../services/store";

export const FinalPage = () => {
    const { room } = useAppSelector((state) => state.room)
    const sortedPlayers = room?.players.sort((a, b) => b.points - a.points);

    return (

        <div className="container mt-2 bg-light text-dark d-flex flex-row justify-content-center">
            {room?.players.map((player) =>
                <div className="container d-flex flex-column" key={player.username}>
                    <h4>{sortedPlayers![0].username === player.username && "Winner"}</h4>
                    <h5>{player.username}</h5>
                    <h1>{player.points} points</h1>
                    <p>Answered questions: {player.points / 10}/{room.numberOfQuestions}</p>
                </div>
            )}
        </div>
    )
}
