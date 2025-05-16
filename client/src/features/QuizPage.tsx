import QuizCard from "../components/QuizCard";

export default function QuizPage() {

    let room = "roomId"; // This should be replaced with the actual room ID logic
    let topic = "General Knowledge"; // This should be replaced with the actual topic logic
    let participants = ["Participant 1", "Participant 2"]; // This should be replaced with the actual participants logic
    let questionIndex = 0; // This should be replaced with the actual question index logic
    let totalQuestions = 10; // This should be replaced with the actual total questions logic
    let timer = 30; // This should be replaced with the actual timer logic
    let question = "What is the capital of France?"; // This should be replaced with the actual question logic
    let options = [
        { text: "Paris", isCorrect: true },
        { text: "London", isCorrect: false },
        { text: "Berlin", isCorrect: false },
        { text: "Madrid", isCorrect: false },
    ]; // This should be replaced with the actual options logic

    return (
        <div className="container mt-1">
            <QuizCard
                room={room}
                topic={topic}
                participants={participants}
                questionIndex={questionIndex}
                totalQuestions={totalQuestions}
                timer={timer}
                question={question}
                options={options}
                onNext={() => console.log("Next question")}
                onHintClick={() => console.log("Hint clicked")}
            />
        </div>
    )
}
