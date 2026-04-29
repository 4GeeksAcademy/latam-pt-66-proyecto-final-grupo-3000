import { Link, useNavigate, useLocation } from "react-router-dom";
// --- INICIO APORTE JHON: Importación corregida del hook ---
import useGlobalReducer from "../hooks/useGlobalReducer"; 
// --- FIN APORTE JHON ---

export const Navbar = () => {
    // --- INICIO APORTE JHON: Uso del reducer global ---
    const { store, dispatch } = useGlobalReducer();
    // --- FIN APORTE JHON ---

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
                    
                    {/* --- INICIO APORTE JHON: Botón Modo Oscuro --- */}
                    <button 
                        className="btn btn-outline-light btn-sm me-3" 
                        onClick={() => dispatch({ type: 'toggle_dark_mode' })}
                    >
                        {store.darkMode ? (
                            <span><i className="fa-solid fa-sun me-1"></i>Modo Claro</span>
                        ) : (
                            <span><i className="fa-solid fa-moon me-1"></i>Modo Oscuro</span>
                        )}
                    </button>
                    {/* --- FIN APORTE JHON --- */}

                    {token ? (
                        <>
                            <span className="navbar-text text-white me-1">
                                <i className="fa-solid fa-user me-1"></i>{nombre}
                            </span>
                            <Link to="/habitos">
                                <button className="btn btn-outline-light btn-sm">
                                    <i className="fa-solid fa-list-check me-1"></i>Mis Hábitos
                                </button>
                            </Link>
                            <Link to="/historial">
                                <button className="btn btn-outline-light btn-sm">
                                    <i className="fa-solid fa-calendar-check me-1"></i>Historial
                                </button>
                            </Link>
<Link to="/exportar">
								<button className="btn btn-outline-light btn-sm">
									<i className="fa-solid fa-file-export me-1"></i>Exportar
								</button>
							</Link>
							<Link to="/reconocimientos">
								<button className="btn btn-outline-light btn-sm">
									<i className="fa-solid fa-trophy me-1"></i>Logros
								</button>
							</Link>
							<Link to="/perfil">
								<button className="btn btn-outline-light btn-sm">
									<i className="fa-solid fa-gear me-1"></i>Mi Perfil
								</button>
							</Link>

                            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket me-1"></i>Cerrar Sesión
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