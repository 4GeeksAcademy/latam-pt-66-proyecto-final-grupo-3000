import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Checkout = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorPago, setErrorPago] = useState("");

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!token) {
            navigate("/login");
            return;
        }

        setErrorPago("");
        setIsProcessing(true);

        // Simulamos la validación bancaria
        setTimeout(async () => {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/suscripcion", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ plan: "premium" }),
            });

            if (!resp.ok) {
                setErrorPago("No se pudo procesar la suscripción. Inténtalo de nuevo.");
                setIsProcessing(false);
                return;
            }

            dispatch({ type: "change_plan", payload: "premium" });
            setIsProcessing(false);
            setShowSuccessModal(true);
        }, 2500);
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 card shadow-lg p-4 border-0">
                    <h4 className="text-center fw-bold mb-4">Información de Pago</h4>
                    {errorPago && <div className="alert alert-danger">{errorPago}</div>}
                    <div className="text-center mb-4">
                        <span className="badge bg-light text-dark p-2 border me-2">Visa</span>
                        <span className="badge bg-light text-dark p-2 border">Mastercard</span>
                    </div>
                    <form onSubmit={handlePayment}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">TITULAR DE LA TARJETA</label>
                            <input type="text" className="form-control" placeholder="Nombre Completo" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">NÚMERO DE TARJETA</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="fa-solid fa-credit-card"></i></span>
                                <input type="text" className="form-control" placeholder="XXXX XXXX XXXX XXXX" maxLength="16" required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-7 mb-3">
                                <label className="form-label small fw-bold">VENCIMIENTO</label>
                                <input type="text" className="form-control" placeholder="MM/AA" required />
                            </div>
                            <div className="col-5 mb-3">
                                <label className="form-label small fw-bold">CVV</label>
                                <input type="password" className="form-control" placeholder="123" maxLength="3" required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 btn-lg mt-3" disabled={isProcessing}>
                            {isProcessing ? (
                                <span><i className="fa-solid fa-spinner fa-spin me-2"></i>Validando...</span>
                            ) : "Confirmar Pago $4.99"}
                        </button>
                    </form>
                </div>
            </div>

            {showSuccessModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Pago aprobado</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setShowSuccessModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="mb-0">
                                        ¡Felicidades! Tu pago fue procesado por Visa/Mastercard. Ya eres Premium.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setShowSuccessModal(false);
                                            navigate("/habitos");
                                        }}>
                                        Ir a mis hábitos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};