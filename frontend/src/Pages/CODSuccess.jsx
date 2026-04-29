import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

export default function CODSuccess() {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentMethod = searchParams.get("payment");

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(`/orders`);
        }, 3000); // Redirect after 3 seconds

        return () => clearTimeout(timer); // Cleanup
    }, [navigate, orderId]);

    return (
        <div
            style={{
                backgroundColor: "#28a745", // Green background
                color: "white",
                height: "100vh", // Full screen height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "2rem",
            }}
        >
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅ Order Placed!</h1>
            <p style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Your order ID is <strong>{orderId}</strong>.
            </p>
            <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
                Payment Method:{" "}
                {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p>
            <p style={{ fontSize: "1rem", opacity: 0.8 }}>
                Redirecting to your order details...
            </p>
            <button
                onClick={() => navigate(`/orders`)}
                style={{
                    marginTop: "2rem",
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    color: "#28a745",
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
            >
                View My Order Now
            </button>
        </div>
    );
}
