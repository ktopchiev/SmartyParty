import { useState } from "react";
import { useAppSelector } from "../../services/store";
import SignalRService from "../../services/signalR/SignalRService";
import type { MessageDto } from "../../models/MessageDto";
import { HubConnectionState } from "@microsoft/signalr";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";

interface Props {
	roomId: string;
}

export default function ChatWindow({ roomId }: Props) {
	const [input, setInput] = useState("");
	const { room } = useAppSelector((state) => state.room);
	const { user } = useAppSelector((state) => state.user);

	const handleSend = async () => {
		if (input.trim()) {
			const messageDto: MessageDto = {
				roomId,
				from: user?.username!,
				content: input.trim(),
				isRead: false,
			};

			if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
				await SignalRService.startUserRoomConnection();
			}

			await SignalRService.sendMessage(messageDto);
			setInput("");
		}
	};

	return (
		<Card className="shadow-lg rounded-4 border-0 border-dark ps-3" style={{ maxWidth: "300px", minHeight: "100%" }}>
			<Card.Header className="text-muted small">Chat</Card.Header>
			<Card.Body className="bg-white rounded mb-2" style={{ height: "60vh", overflowY: "auto" }}>
				{room?.messages?.map((msg) => (
					<Container
						key={msg.id}
						className={`d-flex mb-2 ${msg.from === user?.username ? "justify-content-end" : "justify-content-start"}`}
					>
						<div
							className="px-3 py-2"
							style={{
								backgroundColor: msg.from === user?.username ? "#3498db" : "#e5e7e9",
								color: msg.from === user?.username ? "white" : "black",
								borderRadius: "25px",
								fontSize: 14,
								maxWidth: "150px",
								fontWeight: 500,
								wordWrap: "break-word"
							}}
						>
							{msg.content}
						</div>
					</Container>
				))}
			</Card.Body>
			<Card.Footer className="p-2">
				<Form
					onSubmit={(e) => {
						e.preventDefault();
						handleSend();
					}}
				>
					<Row className="g-1">
						<Col xs={8}>
							<Form.Control
								type="text"
								size="sm"
								placeholder="Type a message..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
							/>
						</Col>
						<Col xs={4}>
							<Button
								type="submit"
								variant="primary"
								size="sm"
								className="w-100"
							>
								Send
							</Button>
						</Col>
					</Row>
				</Form>
			</Card.Footer>
		</Card>
	);
}
