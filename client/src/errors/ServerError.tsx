import { useLocation } from "react-router";

export default function ServerError() {
    const { state } = useLocation();

    return (
        <div className="container">
            {state?.error ? (
                <>
                    <h3 className="text-secondary">
                        {state.error.title}
                    </h3>
                    <hr className="hr" />
                    <p>{state.error.detail || 'Internal server error'}</p>
                </>
            ) : (
                <h5>Server Error</h5>
            )}
        </div>
    )
}