import { Link } from "react-router-dom";

export const Acercade = () => {
    return (
        <div className="container mt-5 pt-5 mb-5">
            <h1 className="display-5 fw-bold mb-4">Sobre Habit Tracker</h1>

            <p className="lead">¿Cuántas veces has empezado de nuevo el lunes?</p>
            <p>
                Sabemos lo que se siente. La motivación dura días, los hábitos duran toda la vida — pero nadie te enseña cómo construirlos.
            </p>
            <p>
                <strong>Habit Tracker</strong> nació para cambiar eso. No es otra app de productividad. Es tu sistema de pequeñas victorias diarias: registra tus rutinas, ve tu progreso en tiempo real y gana reconocimientos cada vez que cumples lo que te propones.
            </p>
            <p>Porque el cambio no llega de golpe. Llega hábito a hábito.</p>
            <p className="text-muted">
                Desarrollada por un equipo de Full Stack Developers Juniors apasionados por construir herramientas que impacten vidas reales.
            </p>

            <hr className="my-4" />

            <h5>Información del Sistema</h5>
            <ul className="list-group shadow-sm border-secondary">
                <li className="list-group-item bg-transparent text-reset border-secondary"><strong>Versión de la App:</strong> 1.0.0</li>
                <li className="list-group-item bg-transparent text-reset border-secondary"><strong>React:</strong> v18.2.0</li>
                <li className="list-group-item bg-transparent text-reset border-secondary"><strong>Vite:</strong> v4.5.9</li>
                <li className="list-group-item bg-transparent text-reset border-secondary"><strong>jsPDF:</strong> v2.5.1</li>
                <li className="list-group-item bg-transparent text-reset border-secondary"><strong>React Router:</strong> v6.18.0</li>
            </ul>

            <div className="mt-5 text-center">
                <Link to="/" className="btn btn-outline-primary">
                    <i className="fa-solid fa-house me-2"></i> Volver al Inicio
                </Link>
            </div>
        </div>
    );
};

export default Acercade;
