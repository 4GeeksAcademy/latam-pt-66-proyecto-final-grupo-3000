import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Suscripciones = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmFreeModal, setShowConfirmFreeModal] = useState(false);
    const [showSuccessFreeModal, setShowSuccessFreeModal] = useState(false);
    const [errorPlan, setErrorPlan] = useState("");

    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const cargarPlan = async () => {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/suscripcion", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!resp.ok) return;
            const data = await resp.json();
            if (data.plan) {
                dispatch({ type: "change_plan", payload: data.plan });
            }
        };

        cargarPlan();
    }, [token, dispatch]);

    const handleSelectFree = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        setErrorPlan("");
        setIsSaving(true);
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/suscripcion", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan: "free" }),
        });

        if (resp.ok) {
            dispatch({ type: "change_plan", payload: "free" });
            setShowConfirmFreeModal(false);
            setShowSuccessFreeModal(true);
        } else {
            setErrorPlan("No se pudo cambiar al plan gratuito. Inténtalo nuevamente.");
        }
        setIsSaving(false);
    };

    return (
        <div className="container py-5 mt-5 suscripciones-page">
            <h2 className="text-center mb-5 fw-bold color-titulo-plan">MEJORA TU ESTILO DE VIDA CON PREMIUM</h2>
            {errorPlan && (
                <div className="alert alert-danger">{errorPlan}</div>
            )}
            <div className="row justify-content-center">

                {/* Tarjeta Plan Gratis */}
                <div className="col-md-4 mb-4">
                    <div className={`card h-100 shadow-sm ${store.plan === 'free' ? 'border-primary border-3' : ''}`}>
                        <div className="card-body text-center d-flex flex-column">
                            <h3 className="card-title fw-bold">Gratis</h3>
                            <h2 className="card-price">$0 <small className="text-muted">/mes</small></h2>
                            <hr />
                            <ul className="list-unstyled mb-4 flex-grow-1 text-start ms-3">
                                <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> Hasta 3 hábitos</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> Historial de hábitos</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> Modo Oscuro</li>
                                <li className="mb-2"><i className="fa-solid fa-xmark text-danger me-2"></i> Notas de reflexión</li>
                            </ul>
                            <button
                                onClick={() => setShowConfirmFreeModal(true)}
                                className={`btn btn-lg ${store.plan === 'free' ? 'btn-primary disabled' : 'btn-outline-primary'}`}
                                disabled={store.plan === 'free' || isSaving}
                            >
                                {store.plan === 'free' ? "Plan Actual" : isSaving ? "Guardando..." : "Elegir Gratis"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tarjeta Plan Premium - Beneficios Exclusivos */}
                <div className="col-md-4 mb-4">
                    <div className={`card h-100 shadow-sm border-warning ${store.plan === 'premium' ? 'border-3' : ''}`}>
                        <div className="card-body text-center d-flex flex-column">
                            <h3 className="card-title text-warning fw-bold text-uppercase">¡Premium!</h3>
                            <h2 className="card-price">$4.99 <small className="text-muted">/mes</small></h2>
                            <hr />
                            <ul className="list-unstyled mb-4 flex-grow-1 text-start ms-3">
                                <li className="mb-2"><i className="fa-solid fa-crown text-warning me-2"></i> <strong>Hábitos ilimitados</strong></li>
                                <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> Modo Oscuro total</li>
                                <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> Historial de hábitos</li>
                                <li className="mb-2"><i className="fa-solid fa-star text-warning me-2"></i> Soporte VIP 24/7</li>
                                <li className="mb-2"><i className="fa-solid fa-user-headset text-primary me-2"></i> Atención Personalizada </li>
                            </ul>

                            <button
                                onClick={() => navigate("/checkout")}
                                className={`btn btn-lg ${store.plan === 'premium' ? 'btn-warning disabled' : 'btn-warning'}`}
                                disabled={store.plan === 'premium'}
                            >
                                <i className="fa-solid fa-credit-card me-2"></i>
                                {store.plan === 'premium' ? "Suscripción Activa" : "Mejorar a Premium"}
                            </button>
                            <div className="mt-3 opacity-75">
                                <i className="fa-brands fa-cc-visa mx-2 fs-3 text-primary"></i>
                                <i className="fa-brands fa-cc-mastercard mx-2 fs-3 text-danger"></i>
                                <i className="fa-brands fa-cc-apple-pay mx-2 fs-3"></i>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {showConfirmFreeModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar cambio de plan</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        disabled={isSaving}
                                        onClick={() => setShowConfirmFreeModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="mb-2">
                                        Vas a cambiar de <strong>Premium</strong> a <strong>Gratis</strong>.
                                    </p>
                                    <p className="mb-0 text-muted small">
                                        Recuerda que en el plan Gratis solo puedes tener hasta 3 hábitos activos.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        disabled={isSaving}
                                        onClick={() => setShowConfirmFreeModal(false)}>
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={isSaving}
                                        onClick={handleSelectFree}>
                                        {isSaving ? "Guardando..." : "Sí, cambiar a Gratis"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            {showSuccessFreeModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header">
                                    <h5 className="modal-title">Plan actualizado</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setShowSuccessFreeModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="mb-0">
                                        Tu suscripción cambió al plan <strong>Gratis</strong> correctamente.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowSuccessFreeModal(false)}>
                                        Entendido
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setShowSuccessFreeModal(false);
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