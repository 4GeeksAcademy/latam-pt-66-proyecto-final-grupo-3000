import React from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Suscripciones = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleSelectFree = () => {
        dispatch({ type: 'change_plan', payload: 'free' });
        alert("Has vuelto al Plan Gratuito.");
    };

    return (
        <div className="container py-5 mt-5">
            <h2 className="text-center mb-5 fw-bold">Mejora tu estilo de vida con Premium</h2>
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
                                <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> Modo Oscuro</li>
                                <li className="mb-2"><i className="fa-solid fa-xmark text-danger me-2"></i> Notas de reflexión</li>
                            </ul>
                            <button 
                                onClick={handleSelectFree}
                                className={`btn btn-lg ${store.plan === 'free' ? 'btn-primary disabled' : 'btn-outline-primary'}`}
                                disabled={store.plan === 'free'}
                            >
                                {store.plan === 'free' ? "Plan Actual" : "Elegir Gratis"}
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
                                <li className="mb-2"><i className="fa-solid fa-check text-success me-2"></i> Notas de reflexión diarias</li>
                                <li className="mb-2"><i className="fa-solid fa-star text-warning me-2"></i> Soporte VIP 24/7</li>
                                <li className="mb-2"><i className="fa-solid fa-chart-line text-primary me-2"></i> Estadísticas avanzadas</li>
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
        </div>
    );
};