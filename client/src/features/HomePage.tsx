import { useAppSelector } from "../services/store";
import { useEffect } from "react";
import SignalRService from "../services/signalR/SignalRService";
import { HubConnectionState } from "@microsoft/signalr";
import { useNavigate } from "react-router";
import type Room from "../models/Room";

import { Container, Table, Button } from "react-bootstrap";
import CreateRoomForm from "../components/CreateRoomForm";

export type FormData = {
	roomName: string;
	topic: string;
	language: string;
	number: string;
	difficulty: string;
};

export default function HomePage() {
	const { loggedIn, user } = useAppSelector((state) => state.user);
	const { roomsList } = useAppSelector((state) => state.room);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAndSetRooms = async () => {
			const connection = SignalRService.getSignalRConnection();

			if (!connection) {
				console.error("No SignalR connection instance found");
				return;
			}

			if (connection.state !== HubConnectionState.Connected) {
				try {
					await SignalRService.startUserRoomConnection();
				} catch (error) {
					console.error("Failed to start SignalR connection", error);
					return;
				}
			}

			await new Promise(resolve => setTimeout(resolve, 100));

			await SignalRService.getRooms();
		};

		fetchAndSetRooms();
	}, []);


	useEffect(() => {

		SignalRService.setOnRoomCreatedCallback((room) => {
			console.log("Room created callback:", room);
			navigate(`/quizroom/${room.id}`);
		});

	}, []);

	const handleJoinRoom = async (roomId: string) => {
		if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
			await SignalRService.startUserRoomConnection();
		}

		await SignalRService.joinRoom(roomId, user?.username!);
		navigate(`/quizroom/${roomId}`);
	}

	// Clean up a room and remove it from the list - Only available for admins
	const handleRemoveRoom = async (roomId: string) => {
		if (SignalRService.getSignalRConnection()?.state === HubConnectionState.Disconnected) {
			await SignalRService.startUserRoomConnection();
		}
		await SignalRService.removeRoom(roomId);
	}

	return (
		<Container className="mt-3 d-flex justify-content-evenly">
			<div>
				<h2 className="text-center">Rooms</h2>
				{!loggedIn && <h5 className="text-center mark">Please log in to create or join rooms.</h5>}
				<Table striped hover size="sm">
					<thead>
						<tr>
							<th>Name</th>
							<th>Creator</th>
							<th>Topic</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{roomsList?.map((room: Room) => (
							<tr key={room.id}>
								<td>{room.name}</td>
								<td>{room.creator}</td>
								<td>{room.topic}</td>
								<td>{room.status}</td>
								<td>
									<Button
										variant="warning"
										className="mx-2"
										size="sm"
										onClick={() => handleJoinRoom(room.id)}
										disabled={!loggedIn || room.players.length >= 2}
									>
										Join
									</Button>
									{user?.username === "admin" && (
										<Button
											variant="danger"
											size="sm"
											onClick={() => handleRemoveRoom(room.id)}
										>
											Remove
										</Button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			{loggedIn && (
				<Container className="d-none d-md-block" style={{ maxWidth: 600 }}>
					<CreateRoomForm />
				</Container>
			)}
		</Container>
	);
}