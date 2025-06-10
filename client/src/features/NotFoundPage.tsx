import { useNavigate } from "react-router"

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <div className="container d-flex flex-column justify-content-center mt-3">
            <h1>Oops, it seems this page does not exist</h1>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>Go Back to Home</button>
        </div>
    )
}
