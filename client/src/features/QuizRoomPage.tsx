import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import SignalRService from "../services/signalR/SignalRService";
import { LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../services/store";
import { HubConnectionState } from "@microsoft/signalr";
import type { Option } from "../models/Room";
import { toast } from "react-toastify";
import type Answer from "../models/Answer";
import { resetCurrentAnswer, setStatus } from "../services/room/roomsSlice";
import ChatUI from "../components/chat/ChatUI";

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
	const { room, status, currentAnswer, questionIndex, availability } = useAppSelector(
		(state) => state.room
	);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const player = useMemo(() => {
		return room?.players.find((p) => p.username === user?.username);
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
								points: player?.points ?? 0,
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

			await SignalRService.getRoom(id, player?.username!);

		};

		dispatch(setStatus('loading'));
		fetchRoom();
	}, []);

	useEffect(() => {

		const joinRoom = async () => {
			await SignalRService.joinRoom(id, user?.username!);
		}

		if (status === 'ready') joinRoom();
	}, [status])

	useEffect(() => {
		const endGame = async () => {
			if (room?.players.length! < 1 || final) {
				await SignalRService.removeRoom(id);
				SignalRService.stopUserRoomConnection();

				final && navigate(`/quizroom/${id}/final`);
			}
		};

		endGame();
	}, [final, room?.players]);

	useEffect(() => {
		if (availability === 'closed') {
			toast.error(`Room ${room?.name} was closed.`);
			navigate("/");
		}
	}, [availability]);

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

		await SignalRService.updatePlayer(id, {
			username: user?.username!,
			points: _option.isCorrect ? 10 : 0,
			currentQuestionIndex: questionIndex,
		});

		const answer: Answer = {
			id: _option.id,
			roomId: id,
			from: user?.username ?? "",
			option: _option,
		};
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
			await SignalRService.updatePlayer(id, {
				username: user?.username!,
				points: 0,
				currentQuestionIndex: questionIndex + 1,
			});
			dispatch(resetCurrentAnswer());
		}
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

	if (status === 'loading') return <div>Loading...</div>

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
						<Badge bg="dark" className="rounded-circle p-2" style={{ minWidth: "50px", textAlign: "center" }}>
							{countdown}
						</Badge>
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
											disabled={showAnswer || countdown === 0}
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
								<Button
									variant="btn btn-warning"
									disabled={!showAnswer}
									onClick={onNext}
									className="fw-semibold"
								>
									Next
								</Button>
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
