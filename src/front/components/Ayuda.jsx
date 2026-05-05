import React from 'react';
import { Link } from "react-router-dom";

export const Ayuda = () => {
    return (
        <div className="container mt-5 pt-5 mb-5">
            <h1 className="text-center mb-4">Preguntas Frecuentes</h1>
            <p className="text-center text-muted mb-5">¿Tienes dudas sobre cómo usar Habit Tracker? Aquí te respondemos.</p>

            <div className="accordion shadow-sm" id="accordionExample">

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                            ¿Cómo empiezo a registrar mis hábitos?
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Es muy fácil. Solo haz clic en el botón <strong>"Comenzar gratis"</strong>, inicia sesión y verás tu tablero principal.
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                            ¿Puedo exportar mis progresos?
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Sí, en tu perfil encontrarás la opción de <strong>Exportar</strong> para generar un PDF con tus estadísticas.
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                            <i className="fa-solid fa-clock-rotate-left me-2 text-primary"></i>
                            ¿Dónde puedo ver mi Historial de actividades?
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Puedes acceder a tu historial desde el menú desplegable en tu perfil (esquina superior derecha).
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                            <i className="fa-solid fa-trophy me-2 text-warning"></i>
                            ¿Cómo funcionan los Logros obtenidos?
                        </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Los logros son medallas que desbloqueas al mantener rachas de hábitos saludables.
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-5 text-center">
                <Link to="/" className="btn btn-primary px-4">Volver al Inicio</Link>
            </div>
        </div>
    );
};
