import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	useLocation(); // re-render on route changes to reflect auth state
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
								<button className="btn btn-outline-light btn-sm">
									<i className="fa-solid fa-right-to-bracket me-1"></i>Iniciar Sesión
								</button>
							</Link>
							<Link to="/registro">
								<button className="btn btn-light btn-sm">
									<i className="fa-solid fa-user-plus me-1"></i>Registrarse
								</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
