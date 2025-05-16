import React, { useState, useEffect } from 'react';

type Option = {
    text: string;
    isCorrect: boolean;
};

type QuizCardProps = {
    room: string;
    topic: string;
    participants: string[];
    questionIndex: number;
    totalQuestions: number;
    timer: number;
    question: string;
    options: Option[];
    onNext: () => void;
    onHintClick: () => void;
};

const QuizCard: React.FC<QuizCardProps> = ({
    room,
    topic,
    participants,
    questionIndex,
    totalQuestions,
    timer,
    question,
    options,
    onNext,
    onHintClick,
}) => {

    const [selected, setSelected] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [countdown, setCountdown] = useState(timer);

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

    const handleSelect = (option: Option, index: number) => {
        if (showAnswer) return;
        setSelected(index);
        setShowAnswer(true);
    };

    return (
        <div className={`container mt-2 bg-light text-dark`} style={{ maxWidth: '900px', minHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-top mb-1">
                <div className="flex-grow-1">
                    <span className="badge bg-dark me-2">Room: <strong>{room}</strong></span>
                    <span className="badge bg-secondary me-2">Topic: <strong>{topic}</strong></span>
                </div>
                <div className="text-end flex-grow-1">
                    <span className="badge bg-primary">Players: {participants.length}/2</span>
                    <ul className="list-unstyled">
                        {participants.map((p, i) => (
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
