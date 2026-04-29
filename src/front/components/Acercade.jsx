import { Link } from "react-router-dom";

export const Acercade = () => {
    return (
        // Usamos 'container' para centrar y 'mt-5 pt-5' para que el Navbar no lo tape
        <div className="container mt-5 pt-5 mb-5">
            <h1 className="display-5 fw-bold">Acerca de la Aplicación</h1>
            <p className="lead">
                Esta aplicación fue diseñada para facilitar la gestión y exportación de datos
                de manera eficiente. Su función principal es permitir a los usuarios visualizar
                información clave y generar reportes de la manera mas sencilla
                para ayudar al usuario con su rutina diaria, dicha rutina estara definida por el usuario
                la cual contara a traves de la app con premios como medallas y trofeos por cumplir su estrategia
                diaria y asi generar una satisfaccion personal en cada avance.

            </p>

            <hr />

            <h3>Información del Sistema</h3>
            <ul className="list-group shadow-sm">
                <li className="list-group-item"><strong>Versión de la App:</strong> 1.0.0</li>
                <li className="list-group-item"><strong>React:</strong> v18.2.0</li>
                <li className="list-group-item"><strong>Vite:</strong> v4.5.9</li>
                <li className="list-group-item"><strong>jsPDF:</strong> v2.5.1</li>
                <li className="list-group-item"><strong>React Router:</strong> v6.18.0</li>
            </ul>
            <div className="mt-5 mb-5 text-center">
                <Link to="/" className="btn btn-outline-primary">
                    <i className="fa-solid fa-house me-2"></i> Volver al Inicio
                </Link>
            </div>
        </div>
    );
};


export default Acercade;