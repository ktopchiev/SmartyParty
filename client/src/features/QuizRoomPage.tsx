import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import SignalRService from '../services/signalR/SignalRService';
import { LogOut } from 'lucide-react';
import { useAppSelector } from '../services/store';
import ChatWindow from '../components/ChatWindow';
import { HubConnectionState } from '@microsoft/signalr';

type Option = {
    text: string;
    isCorrect: boolean;
};

const totalQuestions = 10; // This should be dynamic based on the total number of questions
const question = "What is the capital of France?"; // This should be dynamic based on the current question
const options: Option[] = [
    { text: "Paris", isCorrect: true },
    { text: "London", isCorrect: false },
    { text: "Berlin", isCorrect: false },
    { text: "Madrid", isCorrect: false }
]; // This should be dynamic based on the current question
const timer = 30; // This should be dynamic based on the game settings

const QuizRoomPage: React.FC = () => {

    const [questionIndex, setQuestionIndex] = useState<number>(1);
    const [selected, setSelected] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [countdown, setCountdown] = useState(timer);
    const { roomId } = useParams<{ roomId: string }>();
    const id = roomId!;
    const { user } = useAppSelector((state) => state.user);
    const { room } = useAppSelector((state) => state.room);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchRoom = async () => {
            if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {

                await SignalRService.startUserRoomConnection();
            }

            await SignalRService.getRoomById(id);
        }

        fetchRoom();
    }, [])

    const handleLeaveRoom = async () => {

        await SignalRService.leaveRoom(id, user?.username!);
        console.log("Left room:", id);
        navigate("/");

    };

    const handleSelect = (_option: Option, index: number) => {
        if (showAnswer) return;
        setSelected(index);
        setShowAnswer(true);
    };

    const onNext = () => {
        setSelected(null);
        setShowAnswer(false);
        // Logic to load the next question
        setQuestionIndex((prev) => prev + 1);
    };

    const onHintClick = () => {
        // Logic to show a hint
        console.log("Hint clicked");
    };


    // if (!room) {
    //     return (
    //         <div className="container">
    //             <div className="spinner-grow" style={{ width: "3rem; height: 3rem;" }} role="status">
    //                 <span className="visually-hidden">Loading...</span>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="container mt-2 bg-light text-dark" style={{ maxWidth: '1200px', minHeight: '90vh' }}>
            <div className="row">
                <div className="col-8">
                    <div className="d-flex justify-content-between align-items-top mb-1">
                        <div className="flex-grow-1">
                            <span className="badge bg-dark me-2">Room: <strong>{room?.name}</strong></span>
                            <span className="badge bg-secondary me-2">Topic: <strong>{room?.topic}</strong></span>
                            <span style={{ cursor: "pointer", fontSize: 10 }} onClick={() => handleLeaveRoom()}> <LogOut size={16} /> Leave Room </span>
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
                <div className="col-4 border-start ps-3" style={{ minHeight: '100vh' }}>
                    <ChatWindow roomId={id} />
                </div>
            </div>
        </div>
    );
};

export default QuizRoomPage;
