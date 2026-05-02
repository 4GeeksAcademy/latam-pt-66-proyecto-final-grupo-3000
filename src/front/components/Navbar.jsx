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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="fa-solid fa-list-check me-2"></i>Habit Tracker
                </Link>
                <div className="ms-auto d-flex align-items-center gap-2">
                    
                    {/* BOTONES DE JHON */}
                    <Link to="/suscripciones">
                        <button className="btn btn-warning btn-sm fw-bold">
                            {store.plan === 'premium' ? "Plan Premium" : "Planes"}
                        </button>
                    </Link>

                    <button 
                        className="btn btn-outline-light btn-sm" 
                        onClick={() => dispatch({ type: 'toggle_dark_mode' })}
                    >
                        <i className={store.darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
                    </button>
                    {/* --------------- */}

                    {token ? (
                        <>
                            <span className="navbar-text text-white me-1">
                                <i className="fa-solid fa-user me-1"></i>{nombre}
                            </span>
                            <Link to="/habitos">
                                <button className="btn btn-outline-light btn-sm">Mis Hábitos</button>
                            </Link>
                            <Link to="/historial">
                                <button className="btn btn-outline-light btn-sm">Historial</button>
                            </Link>
                            <Link to="/exportar">
                                <button className="btn btn-outline-light btn-sm">Exportar</button>
                            </Link>
                            <Link to="/reconocimientos">
                                <button className="btn btn-outline-light btn-sm">Logros</button>
                            </Link>
                            <Link to="/perfil">
                                <button className="btn btn-outline-light btn-sm">Mi Perfil</button>
                            </Link>
                            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                        </>
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