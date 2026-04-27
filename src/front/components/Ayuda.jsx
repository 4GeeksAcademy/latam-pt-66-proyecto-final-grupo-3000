import React from 'react';
import { Link } from "react-router-dom";

export const Ayuda = () => {
    return (
        <div className="container mt-5 pt-5 mb-5">
            <h1 className="text-center mb-4">Centro de Ayuda</h1>
            <p className="text-center text-muted mb-5">¿Tienes dudas sobre cómo usar Habit Tracker? Aquí te respondemos.</p>

            <div className="accordion shadow-sm" id="accordionExample">
                {/* Pregunta 1 */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                            ¿Cómo empiezo a registrar mis hábitos?
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Es muy fácil. Solo haz clic en el botón <strong>"Comenzar gratis"</strong>, inicia sesión y verás tu tablero principal donde podrás añadir nuevas metas.
                        </div>
                    </div>
                </div>

                {/* Pregunta 2 */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                            ¿Puedo exportar mis progresos?
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Sí, dentro de tu perfil encontrarás la opción de <strong>Exportar</strong>. Esto generará un archivo PDF con tus estadísticas gracias a nuestra integración con <code>jsPDF</code>.
                        </div>
                    </div>
                </div>

                {/* Pregunta 3 */}
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                            ¿La aplicación es gratuita?
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Actualmente, todas las funciones de <strong>Habit Tracker</strong> son totalmente gratuitas como parte de nuestra versión 1.0.
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 text-center">
                <Link to="/" className="btn btn-outline-primary">
                    <i className="fa-solid fa-house me-2"></i> Volver al Inicio
                </Link>
            </div>
        </div>
    );
};
