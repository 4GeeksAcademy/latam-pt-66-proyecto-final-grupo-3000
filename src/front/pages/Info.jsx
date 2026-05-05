import { Link } from "react-router-dom";

export const Info = () => {
    return (
        <div className="container mt-5 pt-5 mb-5">

            <section className="mb-5">
                <h1 className="display-5 fw-bold mb-3">Acerca de Habit Tracker</h1>
                <p className="lead">
                    ¿Cuántas veces has empezado de nuevo el lunes?
                </p>
                <p>
                    Sabemos lo que se siente. La motivación dura días, los hábitos duran toda la vida — pero nadie te enseña cómo construirlos.
                </p>
                <p>
                    <strong>Habit Tracker</strong> nació para cambiar eso. No es otra app de productividad. Es tu sistema de pequeñas victorias diarias: registra tus rutinas, ve tu progreso en tiempo real y gana reconocimientos cada vez que cumples lo que te propones.
                </p>
                <p>
                    Porque el cambio no llega de golpe. Llega hábito a hábito.
                </p>
                <p className="text-muted">
                    Desarrollada por un equipo de Full Stack Developers Juniors apasionados por construir herramientas que impacten vidas reales.
                </p>

                <hr className="my-4" />

                <h5>Información del Sistema</h5>
                <ul className="list-group shadow-sm">
                    <li className="list-group-item"><strong>Versión de la App:</strong> 1.0.0</li>
                    <li className="list-group-item"><strong>React:</strong> v18.2.0</li>
                    <li className="list-group-item"><strong>Vite:</strong> v4.5.9</li>
                    <li className="list-group-item"><strong>jsPDF:</strong> v2.5.1</li>
                    <li className="list-group-item"><strong>React Router:</strong> v6.18.0</li>
                </ul>
            </section>

            <section className="mb-5">
                <h2 className="fw-bold mb-2">Centro de Ayuda</h2>
                <p className="text-muted mb-4">¿Tienes dudas sobre cómo usar Habit Tracker? Aquí te respondemos.</p>

                <div className="accordion shadow-sm" id="accordionAyuda">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                                ¿Cómo empiezo a registrar mis hábitos?
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionAyuda">
                            <div className="accordion-body">
                                Es muy fácil. Solo haz clic en el botón <strong>"Comenzar gratis"</strong>, inicia sesión y verás tu tablero principal donde podrás añadir nuevas metas.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                                ¿Puedo exportar mis progresos?
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionAyuda">
                            <div className="accordion-body">
                                Sí, dentro de tu perfil encontrarás la opción de <strong>Exportar</strong>. Esto generará un archivo PDF con tus estadísticas gracias a nuestra integración con <code>jsPDF</code>.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                                ¿La aplicación es gratuita?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionAyuda">
                            <div className="accordion-body">
                                Actualmente, todas las funciones de <strong>Habit Tracker</strong> son totalmente gratuitas como parte de nuestra versión 1.0.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="text-center">
                <Link to="/" className="btn btn-outline-primary">
                    <i className="fa-solid fa-house me-2"></i> Volver al Inicio
                </Link>
            </div>
        </div>
    );
};
