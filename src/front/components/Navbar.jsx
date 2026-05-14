import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    useLocation();
    const token = sessionStorage.getItem("token");
    const nombre = sessionStorage.getItem("nombre");
    const isPremium = store.plan === "premium";
    const [showVipModal, setShowVipModal] = useState(false);

    const soporteVip = {
        contactos: [
            {
                nombre: "Marlon Hodgson",
                correo: "marlon.hodgson@habittracker.dev",
                telefono: "+58 412-101-0101",
            },
            {
                nombre: "Jose Alfredo Mujica",
                correo: "alfredo.mujica@habittracker.dev",
                telefono: "+58 414-202-0202",
            },
            {
                nombre: "Jhon Gomez",
                correo: "jhon.gomez@habittracker.dev",
                telefono: "+58 424-303-0303",
            },
            {
                nombre: "Miguel Urrieta",
                correo: "miguel.urrieta@habittracker.dev",
                telefono: "+58 416-404-0404",
            },
        ],
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("nombre");
        navigate("/");
    };

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-gradient-blue-bar">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="fa-solid fa-list-check me-2"></i>Habit Tracker
                </Link>
                <div className="ms-auto d-flex align-items-center gap-2">

                    <Link to="/suscripciones">
                        <button className="btn btn-warning btn-sm fw-bold">
                            {store.plan === 'premium' ? "Plan Premium" : "Planes"}
                        </button>
                    </Link>

                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => dispatch({ type: 'toggle_dark_mode' })}
                    >
                        {store.darkMode ? (
                            <i className="fa-solid fa-sun"></i>
                        ) : (
                            <i className="fa-solid fa-moon"></i>
                        )}
                    </button>

                    {token ? (
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-light btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa-solid fa-user me-1"></i>{nombre}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" to="/habitos">
                                        <i className="fa-solid fa-list-check me-2"></i>Mis Hábitos
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/historial">
                                        <i className="fa-solid fa-calendar-check me-2"></i>Historial
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/exportar">
                                        <i className="fa-solid fa-file-export me-2"></i>Exportar
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/reconocimientos">
                                        <i className="fa-solid fa-trophy me-2"></i>Logros
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/perfil">
                                        <i className="fa-solid fa-gear me-2"></i>Mi Perfil
                                    </Link>
                                </li>
                                {isPremium && (
                                    <>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button
                                                type="button"
                                                className="dropdown-item text-warning fw-semibold"
                                                onClick={() => setShowVipModal(true)}
                                            >
                                                <i className="fa-solid fa-crown me-2"></i>Soporte VIP 24/7
                                            </button>
                                        </li>
                                    </>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="btn btn-outline-light btn-sm">Iniciar Sesión</button>
                            </Link>
                            <Link to="/registro">
                                <button className="btn btn-light btn-sm">Registrarse</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>

        {showVipModal && (
            <>
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title text-warning fw-bold">
                                    <i className="fa-solid fa-crown me-2"></i>Soporte VIP 24/7
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowVipModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="small text-muted mb-3">
                                    Como usuario Premium tienes acceso directo al equipo de soporte.
                                </p>
                                <ul className="list-group list-group-flush">
                                    {soporteVip.contactos.map((contacto) => (
                                        <li key={contacto.nombre} className="list-group-item px-0">
                                            <div className="fw-semibold">{contacto.nombre}</div>
                                            <div className="small">
                                                <i className="fa-solid fa-envelope me-2 text-primary"></i>{contacto.correo}
                                            </div>
                                            <div className="small">
                                                <i className="fa-solid fa-phone me-2 text-success"></i>{contacto.telefono}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowVipModal(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </>
        )}
        </>
    );
};
