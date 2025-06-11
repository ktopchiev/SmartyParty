import { useNavigate } from "react-router";
import { Container, Button } from "react-bootstrap";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center mt-5" style={{ minHeight: '60vh' }}>
            <h1 className="mb-4 text-center">Oops, it seems this page does not exist</h1>
            <Button variant="primary" onClick={() => navigate("/")}>
                Go Back to Home
            </Button>
        </Container>
    );
}
