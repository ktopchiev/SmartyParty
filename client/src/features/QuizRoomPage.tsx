import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import SignalRService from '../services/signalR/SignalRService';
import { LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../services/store';
import ChatWindow from '../components/ChatWindow';
import { HubConnectionState } from '@microsoft/signalr';
import type { Option } from '../models/Room';
import { toast } from 'react-toastify';
import type Answer from '../models/Answer';
import { resetCurrentAnswer } from '../services/room/roomsSlice';

const timer = 30;

const QuizRoomPage: React.FC = () => {
    const [final, setFinal] = useState<boolean>(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [countdown, setCountdown] = useState(timer);
    const [gameStart, setGameStart] = useState<boolean>(false);
    const { roomId } = useParams<{ roomId: string }>();
    const id = roomId!;
    const { user } = useAppSelector((state) => state.user);
    const { room, status, currentAnswer, questionIndex, isLoaded } = useAppSelector((state) => state.room);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const player = useMemo(() => {
        return room?.players.find(p => p.username === user?.username);
    }, [room?.players]);

    useEffect(() => {
        if (gameStart) {
            setCountdown(timer);
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        if (questionIndex + 1 < room?.questions.length!) {
                            const updatedPlayer = {
                                ...player,
                                username: user?.username!,
                                currentQuestionIndex: questionIndex! + 1,
                                points: player?.points ?? 0
                            };
                            SignalRService.updatePlayer(id, updatedPlayer);
                        } else {
                            setFinal(true);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [questionIndex, timer, gameStart]);

    useEffect(() => {

        SignalRService.setOnErrorCallback((error) => {
            console.error("SignalR error:", error);
            navigate("/not-found"); // Redirect user
        });

        const fetchRoom = async () => {
            if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {

                await SignalRService.startUserRoomConnection();
            }
            await SignalRService.getRoomById(id);
        }

        fetchRoom();

    }, [])

    useEffect(() => {
        const endGame = async () => {
            if (room?.players.length! < 1 || final) {
                await SignalRService.removeRoom(id);
                SignalRService.stopUserRoomConnection();

                final && navigate(`/quizroom/${id}/final`)
            };
        }

        endGame();
    }, [final, room?.players])

    useEffect(() => {
        if (status === 'closed') {
            toast.error(`Room ${room?.name} was closed.`);
            navigate("/");
        }
    }, [status])

    const handleLeaveRoom = async () => {
        if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {

            await SignalRService.startUserRoomConnection();
        }
        await SignalRService.leaveRoom(id, user?.username!);
        console.log("Left room:", id);
        navigate("/");

    };

    const handleSelect = async (_option: Option, index: number) => {
        if (showAnswer) return;
        setSelected(index);
        setShowAnswer(true);

        if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {

            await SignalRService.startUserRoomConnection();
        }

        await SignalRService.updatePlayer(id,
            {
                username: user?.username!,
                points: _option.isCorrect ? 10 : 0,
                currentQuestionIndex: questionIndex,
            });

        const answer: Answer = {
            id: _option.id,
            roomId: id,
            from: user?.username ?? "",
            option: _option,
        }
        await SignalRService.sendAnswer(answer);
    };

    const onNext = async () => {
        setSelected(null);
        setShowAnswer(false);
        if (questionIndex + 1 < room?.questions.length!) {
            if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {

                await SignalRService.startUserRoomConnection();
            }
            console.log("Question index before", questionIndex);
            await SignalRService.updatePlayer(id,
                {
                    username: user?.username!,
                    points: 0,
                    currentQuestionIndex: questionIndex + 1
                });
            dispatch(resetCurrentAnswer());
        }
    };

    const onHintClick = () => {
        // Logic to show a hint
        console.log("Hint clicked");
    };

    function setAnswerBadge(opt: Option, idx: number) {
        return (
            currentAnswer &&
                opt.id === currentAnswer?.option.id && currentAnswer.id - 1 === idx
                ?
                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger'>{
                    currentAnswer.from.length > 5 ? currentAnswer.from.slice(0, 3) + "..." : currentAnswer.from
                }</span>
                :
                ""
        )
    }

    return (
        <div className="container mt-2 bg-light text-dark" style={{ maxWidth: '1200px', minHeight: '90vh' }}>
            <div className="row">
                <div className="col-8">
                    <div className="d-flex justify-content-between align-items-top mb-1">
                        <div className="flex-grow-1">
                            <span className="badge bg-dark me-2">Room: <strong>{room?.name}</strong></span>
                            <span className="badge bg-secondary me-2">Topic: <strong>{room?.topic}</strong></span>
                            <span className="badge bg-danger me-2">Difficulty: <strong>{room?.difficulty}</strong></span>
                            <span style={{ cursor: "pointer", fontSize: 10 }} onClick={() => handleLeaveRoom()}> <LogOut size={16} /> Leave Room </span>
                        </div>
                        <div className="text-end flex-grow-1">
                            <span className="badge bg-primary">Players: {room?.players.length}/2</span>
                            <ul className="list-unstyled">
                                {room?.players.map((p, i) => (
                                    <li key={i} className="small">👤 {p.username} : {p.points} points</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="small text-muted">Question <strong>{room?.questions[questionIndex].id} of {room?.numberOfQuestions || 0}</strong></div>
                        <div className="progress flex-grow-1 mx-3" style={{ height: '5px' }}>
                            <div className="progress-bar bg-warning" style={{ width: `${(room?.questions[questionIndex].id! / (room?.numberOfQuestions)! || 0) * 100}%` }}></div>
                        </div>
                        <div className="badge bg-dark rounded-circle p-2" style={{ minWidth: '50px', textAlign: 'center' }}>
                            {countdown}
                        </div>
                    </div>

                    <div className={`card shadow-lg rounded-4 border-0 bg-light text-dark border-dark`}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="mb-0">Question <span className="text-warning">{String(room?.questions[questionIndex].id).padStart(2, '0')}</span></h6>
                                <button className="btn btn-sm btn-warning disabled" onClick={onHintClick}>Hint</button>
                            </div>

                            <h3 className="my-3 text-center">{room?.questions[questionIndex].questionContent || ""}</h3>

                            <div className="list-group mx-3">
                                {room?.questions[questionIndex].options.map((opt, idx) => {
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
                                            disabled={showAnswer || countdown == 0}
                                        >
                                            {opt.content}
                                            {isRight && '✔️'}
                                            {isWrong && '❌'}
                                            {setAnswerBadge(opt, idx)}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="d-grid mt-2">
                                <button className={`btn btn-warning fw-bold`} onClick={onNext} disabled={!showAnswer || (questionIndex + 1 == room?.numberOfQuestions)}>
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
