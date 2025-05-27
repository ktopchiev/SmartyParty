import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../services/store';

type Option = {
    text: string;
    isCorrect: boolean;
};


const questionIndex = 1; // This should be dynamic based on the current question
const totalQuestions = 10; // This should be dynamic based on the total number of questions
const question = "What is the capital of France?"; // This should be dynamic based on the current question
const options: Option[] = [
    { text: "Paris", isCorrect: true },
    { text: "London", isCorrect: false },
    { text: "Berlin", isCorrect: false },
    { text: "Madrid", isCorrect: false }
]; // This should be dynamic based on the current question
const timer = 30; // This should be dynamic based on the game settings

const QuizCard: React.FC = () => {

    const [selected, setSelected] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [countdown, setCountdown] = useState(timer);
    const { roomState: room } = useAppSelector((state) => state.room);

    useEffect(() => {
        setCountdown(timer);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [questionIndex, timer]);

    const handleSelect = (_option: Option, index: number) => {
        if (showAnswer) return;
        setSelected(index);
        setShowAnswer(true);
    };

    const onNext = () => {
        setSelected(null);
        setShowAnswer(false);
        // Logic to load the next question
    };

    const onHintClick = () => {
        // Logic to show a hint
        console.log("Hint clicked");
    };

    return (
        <div className={`container mt-2 bg-light text-dark`} style={{ maxWidth: '900px', minHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-top mb-1">
                <div className="flex-grow-1">
                    <span className="badge bg-dark me-2">Room: <strong>{room?.name}</strong></span>
                    <span className="badge bg-secondary me-2">Topic: <strong>{room?.topic}</strong></span>
                </div>
                <div className="text-end flex-grow-1">
                    <span className="badge bg-primary">Players: {room?.players.length}/2</span>
                    <ul className="list-unstyled">
                        {room?.players.map((p, i) => (
                            <li key={i} className="small">👤 {p}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="small text-muted">Question <strong>{questionIndex} of {totalQuestions}</strong></div>
                <div className="progress flex-grow-1 mx-3" style={{ height: '5px' }}>
                    <div className="progress-bar bg-warning" style={{ width: `${(questionIndex / totalQuestions) * 100}%` }}></div>
                </div>
                <div className="badge bg-dark rounded-circle p-2" style={{ minWidth: '50px', textAlign: 'center' }}>
                    {countdown}
                </div>
            </div>

            <div className={`card shadow-lg rounded-4 border-0 bg-light text-dark border-dark`}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0">Question <span className="text-warning">{String(questionIndex).padStart(2, '0')}</span></h6>
                        <button className="btn btn-sm btn-warning disabled" onClick={onHintClick}>Hint</button>
                    </div>

                    <h3 className="my-3 text-center">{question}</h3>

                    <div className="list-group">
                        {options.map((opt, idx) => {
                            const isSelected = selected === idx;
                            const correct = opt.isCorrect;
                            const isWrong = showAnswer && isSelected && !correct;
                            const isRight = showAnswer && correct;

                            let className = 'list-group-item list-group-item-action my-2 rounded';
                            if (isRight) className += ' bg-success text-white d-flex justify-content-between';
                            else if (isWrong) className += ' border border-warning text-warning d-flex justify-content-between';
                            else className += `bg-light text-dark`;

                            return (
                                <button
                                    key={idx}
                                    className={className}
                                    onClick={() => handleSelect(opt, idx)}
                                    disabled={showAnswer}
                                >
                                    {opt.text}
                                    {isRight && '✔️'}
                                    {isWrong && '❌'}
                                </button>
                            );
                        })}
                    </div>

                    <div className="d-grid mt-2">
                        <button className="btn btn-warning fw-bold" onClick={onNext} disabled={!showAnswer}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;
