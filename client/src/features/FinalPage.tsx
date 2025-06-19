import React from "react";
import { useAppSelector } from "../services/store";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { Link } from "react-router";
import { useScreenSize } from "../hooks/useScreenSize";

export const FinalPage: React.FC = () => {
    const { room } = useAppSelector((state) => state.room);
    const sortedPlayers = room?.players.slice().sort((a, b) => b.points - a.points);
    let draw = sortedPlayers && sortedPlayers[0].points === sortedPlayers[1].points;
    const screenSize = useScreenSize();

    if (!room) return null;

    return (
        <Container className="bg-light mt-3 text-dark d-flex flex-column align-items-center">
            {draw &&
                <Row className="m-4">
                    <h3>Draw</h3>
                </Row>
            }
            <Row className="w-150 justify-content-center">
                {room.players.map((player) => {
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
                <Link to="/" role="button" className="btn btn-primary">Back to Home</Link>
            </Row>
        </Container>
    );
};
