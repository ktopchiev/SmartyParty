import React from "react";
import { useAppSelector } from "../services/store";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

export const FinalPage: React.FC = () => {
    const { room } = useAppSelector((state) => state.room);
    const sortedPlayers = room?.players.slice().sort((a, b) => b.points - a.points);

    if (!room) return null;

    return (
        <Container className="mt-4 bg-light text-dark min-vh-100 d-flex justify-content-center">
            <Row className="w-100 justify-content-center">
                {room.players.map((player) => {
                    const isWinner = sortedPlayers![0].username === player.username;
                    return (
                        <Col key={player.username} xs={12} md={4} className="mb-4">
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
                                <Card.Body>
                                    <Card.Title>{player.username}</Card.Title>
                                    <Card.Text className="display-4 fw-bold">{player.points} points</Card.Text>
                                    <Card.Text>
                                        Answered questions: {player.points / 10} / {room.numberOfQuestions}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};
