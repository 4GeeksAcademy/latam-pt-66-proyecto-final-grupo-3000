import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    useLocation();
    const token = sessionStorage.getItem("token");
    const nombre = sessionStorage.getItem("nombre");

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("nombre");
        navigate("/");
    };

    return (
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
    );
};
