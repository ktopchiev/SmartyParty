import { useLocation } from "react-router";
import { Container } from "react-bootstrap";

export default function ServerError() {
    const { state } = useLocation();

    return (
        <Container>
            {state?.error ? (
                <>
                    <h3 className="text-secondary">{state.error.title}</h3>
                    <hr />
                    <p>{state.error.detail || "Internal server error"}</p>
                </>
            ) : (
                <h5>Server Error</h5>
            )}
        </Container>
    );
}
