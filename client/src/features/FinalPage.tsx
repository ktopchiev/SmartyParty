import React from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../services/store";
import { removeRoom } from "../services/room/roomsSlice";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";


export const FinalPage: React.FC = () => {

    const { room } = useAppSelector((state) => state.rooms);
    const sortedPlayers = room?.players.slice().sort((a, b) => b.points - a.points);
    let draw = sortedPlayers && sortedPlayers[0].points === sortedPlayers[1].points;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // if (!room) return null;

    const handleBackToHome = () => {
        navigate("/");
        if (room) {
            dispatch(removeRoom(room?.id));
        }
    }

    return (
        <Container className="bg-light mt-3 text-dark d-flex flex-column align-items-center">
            {draw &&
                <Row className="m-4">
                    <h3>Draw</h3>
                </Row>
            }
            <Row className="w-150 justify-content-center">
                {room?.players.map((player) => {
                    const isWinner = !draw && sortedPlayers![0].username === player.username;
                    return (
                        <Col key={player.username} xs={6} md={6} className="mb-4">
                            <Card
                                border={isWinner ? "warning" : undefined}
                                className={`text-center p-3 shadow-sm ${isWinner ? "bg-warning bg-opacity-25" : ""}`}
                            >
                                <Card.Header>
                                    {isWinner && (
                                        <Badge bg="warning" text="dark" className="fs-5">
                                            Winner 🏆
                                        </Badge>
                                    )}
                                </Card.Header>
                                <Card.Body className="p-1">
                                    <Card.Title>{player.username}</Card.Title>
                                    <Card.Text className="display-5 fw-bold">{player.points}</Card.Text>
                                    <Card.Text className="display-5 fw-bold">points</Card.Text>
                                    <Card.Text className="fs-6">
                                        Answered questions: {player.points / 10} / {room.numberOfQuestions}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
            <Row>
                <Button type="button" className="btn btn-primary" onClick={() => handleBackToHome()}>Back to Home</Button>
            </Row>
        </Container>
    );
};
