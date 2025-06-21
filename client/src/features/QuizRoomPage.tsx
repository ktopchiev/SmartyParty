import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import SignalRService from "../services/signalR/SignalRService";
import { LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../services/store";
import { HubConnectionState } from "@microsoft/signalr";
import type { Option } from "../models/Room";
import { toast } from "react-toastify";
import type Answer from "../models/Answer";
import { setStatus } from "../services/room/roomsSlice";
import ChatUI from "../components/chat/ChatUI";
import Loading from "../components/Loading";
import type { GameStatus } from "../models/GameStatus";
import type { Player } from "../models/Player";
import { useRoomTimer } from "../hooks/useRoomTimer";
import AnimatedTimer from "../components/quiz-room/AnimatedTimer";
import {
	Container,
	Row,
	Col,
	Badge,
	Button,
	ProgressBar,
	ListGroup,
	Card,
} from "react-bootstrap";

const QuizRoomPage: React.FC = () => {

	const [selected, setSelected] = useState<number | null>(null);
	const [showAnswer, setShowAnswer] = useState(false);

	const { roomId } = useParams<{ roomId: string }>();
	const navigate = useNavigate();

	const { timeLeft, hasEnded, startTimer } = useRoomTimer(roomId!, false);

	const { user } = useAppSelector((state) => state.user);
	const { room, status, currentAnswer, questionIndex, availability, gameStatus } = useAppSelector((state) => state.room);
	const dispatch = useAppDispatch();

	const timer = 30;

	const player = useMemo(() => {
		return room?.players.find((p) => p.username === user?.username);
	}, [room?.players]);

	useEffect(() => {
		if (questionIndex + 1 < (room?.questions.length || 0)) {
			updatePlayer();
		}

		if (hasEnded) {
			setGameFinale();
		}
	}, [questionIndex, hasEnded]);

	const updatePlayer = async () => {
		const updatedPlayer = {
			...player,
			username: user?.username!,
			currentQuestionIndex: questionIndex + 1,
			points: player?.points ?? 0,
		};

		await SignalRService.updatePlayer(roomId!, updatedPlayer);
	};

	const setGameFinale = async () => {
		const gameStatus: GameStatus = {
			roomId: roomId!,
			status: "finale",
		};

		await SignalRService.sendGameStatus(gameStatus);
	};

	useEffect(() => {

		SignalRService.setOnErrorCallback((error) => {
			console.error("SignalR error:", error);
			navigate("/not-found"); // Redirect user
		});

		const fetchRoom = async () => {
			dispatch(setStatus('loading'));
			if (SignalRService.getSignalRConnection()?.state !== HubConnectionState.Connected) {
				await SignalRService.startUserRoomConnection();
			}

			await SignalRService.getRoom(roomId!, player?.username!);
		};

		fetchRoom();
	}, []);

	useEffect(() => {

		const joinRoom = async () => {
			await SignalRService.joinRoom(roomId!, user?.username!);
		}

		if (status === 'ready') joinRoom();
	}, [status])

	useEffect(() => {
		const endGame = async () => {
			if (gameStatus === "finale") {
				await SignalRService.removeRoom(roomId!);
				SignalRService.stopUserRoomConnection();

				gameStatus === "finale" && navigate(`/quizroom/${roomId!}/finalе`);
			}
		};

		endGame();
	}, [gameStatus, room?.players]);

	useEffect(() => {
		if (availability === 'closed') {
			toast.error(`Room ${room?.name} was closed.`);
			navigate("/");
		}
	}, [availability]);

	const handleLeaveRoom = async () => {
		if (SignalRService.getSignalRConnection()?.state !== HubConnectionState.Connected) {
			await SignalRService.startUserRoomConnection();
		}
		await SignalRService.leaveRoom(roomId!, user?.username!);
		navigate("/");
	};

	const handleSelect = async (_option: Option, index: number) => {
		if (showAnswer) return;
		setSelected(index);
		setShowAnswer(true);

		if (SignalRService.getSignalRConnection()?.state !== HubConnectionState.Connected) {
			await SignalRService.startUserRoomConnection();
		}

		const player: Player = {
			username: user?.username ?? "",
			points: _option.isCorrect ? 10 : 0,
			currentQuestionIndex: questionIndex,
		}

		await SignalRService.updatePlayer(roomId!, player);

		const answer: Answer = {
			id: _option.id,
			roomId: roomId!,
			from: user?.username ?? "",
			option: _option,
		};

		await SignalRService.sendAnswer(answer);

	};

	const handleStart = async (timerSeconds: number) => {
		const gameStatus: GameStatus = {
			roomId: roomId!,
			status: "start",
		};

		await SignalRService.sendGameStatus(gameStatus);
		startTimer(timerSeconds);
	};

	const onHintClick = () => {
		// Logic to show a hint
		console.log("Hint clicked");
	};

	function setAnswerBadge(opt: Option, idx: number) {
		return currentAnswer && opt.id === currentAnswer?.option.id && currentAnswer.id - 1 === idx ? (
			<Badge
				pill
				bg="danger"
				className="position-absolute top-0 start-100 translate-middle"
				style={{ fontSize: "0.7rem" }}
			>
				{currentAnswer.from.length > 5 ? currentAnswer.from.slice(0, 3) + "..." : currentAnswer.from}
			</Badge>
		) : (
			""
		);
	}

	if (status === 'loading') return <Loading />

	return (
		<Container fluid="md" className="mt-2 bg-light text-dark" style={{ minHeight: "90vh", maxWidth: "1200px" }}>
			<Row>
				<Col md={8}>
					<div className="d-flex justify-content-between align-items-start mb-3">
						<Col xs={4} md={8}>
							<Badge bg="dark" className="me-2">
								Room: <strong>{room?.name}</strong>
							</Badge>
							<Badge bg="secondary" className="me-2">
								Topic: <strong>{room?.topic}</strong>
							</Badge>
							<Badge bg="danger" className="me-2">
								Difficulty: <strong>{room?.difficulty}</strong>
							</Badge>
							<span
								style={{ cursor: "pointer", fontSize: 10 }}
								onClick={handleLeaveRoom}
								title="Leave Room"
								className="ms-2 text-decoration-underline"
							>
								<LogOut size={16} /> Leave Room
							</span>
						</Col>
						<Col xs={6} md={4} className="text-end">
							<Badge bg="primary">Players: {room?.players.length}/2</Badge>
							<ListGroup variant="flush" className="mt-1 small">
								{room?.players.map((p, i) => (
									<ListGroup.Item key={i} className="p-0 border-0 bg-light">
										👤 {p.username} : {p.points} points
									</ListGroup.Item>
								))}
							</ListGroup>
						</Col>
					</div>

					<div className="d-flex justify-content-between align-items-center mb-3">
						<div className="small text-muted">
							Question <strong>{room?.questions[questionIndex]?.id} of {room?.numberOfQuestions || 0}</strong>
						</div>
						<ProgressBar
							className="flex-grow-1 mx-3"
							style={{ height: "5px" }}
							now={((room?.questions[questionIndex]?.id! / (room?.numberOfQuestions || 1)) * 100) || 0}
							variant="warning"
						/>

						{/* Timer */}
						<AnimatedTimer seconds={timeLeft} hasEnded={hasEnded} />
					</div>

					<Card className="shadow-lg rounded-4 border-0 bg-light text-dark border-dark">
						<Card.Body className="p-4">
							<div className="d-flex justify-content-between align-items-center mb-1">
								<h6 className="mb-0">
									Question <span className="text-warning">{String(room?.questions[questionIndex]?.id).padStart(2, "0")}</span>
								</h6>
								<Button size="sm" variant="warning" disabled onClick={onHintClick}>
									Hint
								</Button>
							</div>

							<h3 className="my-3 text-center">{room?.questions[questionIndex]?.questionContent || ""}</h3>

							<ListGroup className="mx-3">
								{room?.questions[questionIndex]?.options.map((opt: Option, idx) => {
									const isSelected = selected === idx;
									const correct = opt.isCorrect;
									const isWrong = showAnswer && isSelected && !correct;
									const isRight = showAnswer && correct;

									let variant = undefined;
									if (isRight) variant = "success";
									else if (isWrong) variant = "warning";

									return (
										<ListGroup.Item
											key={idx}
											action
											onClick={() => handleSelect(opt, idx)}
											active={isSelected}
											disabled={showAnswer || timeLeft === 0 || gameStatus !== "start"}
											variant={variant}
											className="position-relative d-flex justify-content-between align-items-center my-2 rounded"
											style={{ cursor: showAnswer ? "default" : "pointer" }}
										>
											<span>{opt.content}</span>
											{setAnswerBadge(opt, idx)}
										</ListGroup.Item>
									);
								})}
							</ListGroup>

							<Row className="text-center mt-4">
								{room?.creator === user?.username &&
									(<Button
										variant="btn btn-success"
										disabled={(room?.players.length ?? 0) < 2}
										onClick={() => handleStart(timer)}
										className="fw-semibold"
										style={{ display: gameStatus !== "init" ? "none" : "block" }}
									>
										Start
									</Button>)}
							</Row>
						</Card.Body>
					</Card>
				</Col>

				<Col md={4}>
					<ChatUI />
				</Col>
			</Row>
		</Container>
	);
};

export default QuizRoomPage;
