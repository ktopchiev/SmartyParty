import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div className="position-fixed top-50 start-50 translate-middle">
      <Spinner animation="grow" variant="warning" />
    </div>
  )
}