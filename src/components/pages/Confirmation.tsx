import {useEffect, useState} from "react";
import {Navigate, Link} from "react-router";

export default function Confirmation() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        fetch(`http://localhost:8080/checkout/session-status?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, []);

    if (status === 'open') {
        return (
            <Navigate to="/checkout" />
        )
    }

    if (status === 'complete') {
        return (
            <div className="container-fluid px-4 py-5 text-center">
                {/* Checkmark icon */}
                <div className="confirm-icon d-flex align-items-center justify-content-center mx-auto mb-4">
                    <i className="bi bi-check-lg"></i>
                </div>

                <h1 className="text-white fw-bold mb-3">Order Confirmed!</h1>

                <p className="text-muted mb-4" style={{maxWidth: 440, margin: "0 auto"}}>
                    We appreciate your business! A confirmation email will be sent to{" "}
                    <span className="text-gold">{customerEmail}</span>.
                    <br /><br />
                    If you have any questions, please email{" "}
                    <a href="mailto:orders@example.com" className="text-gold">orders@example.com</a>.
                </p>

                {/* Back to shop */}
                <Link to="/" className="btn btn-warning">
                    <i className="bi bi-arrow-left me-2"></i>
                    Keep Shopping
                </Link>
            </div>
        )
    }

    return null;
}