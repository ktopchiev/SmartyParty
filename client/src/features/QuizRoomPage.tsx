import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { HubConnectionState } from "@microsoft/signalr";
import SignalRService from "../services/signalR/SignalRService";
import { setStatus } from "../services/room/roomsSlice";
import { useAppDispatch, useAppSelector } from "../services/store";
import type { GameStatus } from "../models/GameStatus";
import type { Option } from "../models/Room";
import type Answer from "../models/Answer";
import type { Player } from "../models/Player";
import ChatUI from "../components/chat/ChatUI";
import Loading from "../components/Loading";
import AnimatedTimer from "../components/quiz-room/AnimatedTimer";
import { useRoomTimer } from "../hooks/useRoomTimer";
import { UserContext } from "../context/userContext";
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


export default function QuizRoomPage() {

	const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
	const [showAnswer, setShowAnswer] = useState(false);

	const { roomId } = useParams<{ roomId: string }>();
	const navigate = useNavigate();

	const { timeLeft, roundHasEnded, startTimer } = useRoomTimer(roomId!, false);

	const username = useContext(UserContext);

	const { room, status } = useAppSelector((state) => state.rooms);
	const { currentAnswer, questionIndex, availability, gameStatus } = room || {};
	const dispatch = useAppDispatch();

	const timer = 30;

	const player = useMemo(() => {
		return room?.players.find((p) => p.username === username);

	}, [room?.players]);


	const isQuizEnded = (): boolean => roundHasEnded === true && (questionIndex || 0) + 1 >= (room?.questions.length || 0);


	const updatePlayer = async (questionIndex: number, points: number = 0) => {
		const updatedPlayer: Player = {
			username: player?.username ?? "",
			currentQuestionIndex: questionIndex,
			points: points,
		};

		await SignalRService.updatePlayer(roomId!, updatedPlayer);

	};


	const setGameFinale = async () => {
		console.log("setGameFinale");
		await SignalRService.removeRoom(roomId!);
		SignalRService.stopUserRoomConnection();
		navigate(`/quizroom/${roomId!}/finale`);

	};


	useEffect(() => {
		if (!isQuizEnded() && roundHasEnded) {
			updatePlayer((questionIndex || 0) + 1);
		}

		if (isQuizEnded()) {
			setGameFinale();
		}

	}, [roundHasEnded]);


	useEffect(() => {
		SignalRService.setOnErrorCallback((error) => {
			console.error("SignalR error:", error);
			dispatch(setStatus('error'));
			navigate("/not-found"); // Redirect user

		});

		const fetchRoom = async () => {
			dispatch(setStatus('loading'));
			if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
				await SignalRService.startUserRoomConnection();
			}

			await SignalRService.getRoom(roomId!, player?.username || "");

		};

		fetchRoom();

	}, []);


	useEffect(() => {
		const joinRoom = async () => {
			await SignalRService.joinRoom(roomId!, username);

		}

		if (status === 'ready') joinRoom();

	}, [status]);


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
		await SignalRService.leaveRoom(roomId!, username);
		navigate("/");

	};


	const handleSelect = async (_option: Option, index: number) => {
		if (showAnswer) return;
		setSelectedOpt(index);
		setShowAnswer(true);

		if (SignalRService.getSignalRConnection()?.state !== HubConnectionState.Connected) {
			await SignalRService.startUserRoomConnection();
		}

		updatePlayer((questionIndex || 0), _option.isCorrect ? 10 : 0)

		const answer: Answer = {
			id: _option.id,
			roomId: roomId!,
			from: player?.username ?? "",
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
									<ListGroup.Item key={i} className="p-0 border-0 bg-light" style={{ textShadow: p.username === username ? '0px 2px 2px rgba(15, 15, 15, 0.4)' : '' }}>
										👤 {p.username} : {p.points} points
									</ListGroup.Item>
								))}
							</ListGroup>
						</Col>
					</div>

					<div className="d-flex justify-content-between align-items-center mb-3">
						<div className="small text-muted">
							Question <strong>{room?.questions[questionIndex || 0]?.id} of {room?.numberOfQuestions || 0}</strong>
						</div>
						<ProgressBar
							className="flex-grow-1 mx-3"
							style={{ height: "5px" }}
							now={((room?.questions[questionIndex || 0]?.id! / (room?.numberOfQuestions || 1)) * 100) || 0}
							variant="warning"
						/>

						{/* Timer */}
						<AnimatedTimer seconds={timeLeft} hasEnded={roundHasEnded} />
					</div>

					<Card className="shadow-lg rounded-4 border-0 bg-light text-dark border-dark">
						<Card.Body className="p-4">
							<div className="d-flex justify-content-between align-items-center mb-1">
								<h6 className="mb-0">
									Question <span className="text-warning">{String(room?.questions[questionIndex || 0]?.id).padStart(2, "0")}</span>
								</h6>
								<Button size="sm" variant="warning" disabled onClick={onHintClick}>
									Hint
								</Button>
							</div>

							<h3 className="my-3 text-center">{room?.questions[questionIndex || 0]?.questionContent || ""}</h3>

							<ListGroup className="mx-3">
								{room?.questions[questionIndex || 0]?.options.map((opt: Option, idx) => {
									const isSelected = selectedOpt === idx;
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
								{room?.creator === username &&
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
