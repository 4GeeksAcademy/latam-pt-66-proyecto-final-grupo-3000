import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Checkout = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulamos la validación bancaria
        setTimeout(() => {
            dispatch({ type: 'change_plan', payload: 'premium' });
            setIsProcessing(false);
            alert("¡Felicidades! Tu pago ha sido procesado por Visa/Mastercard. Ya eres Premium.");
            navigate("/habitos");
        }, 2500);
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 card shadow-lg p-4 border-0">
                    <h4 className="text-center fw-bold mb-4">Información de Pago</h4>
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
        </div>
    );
};