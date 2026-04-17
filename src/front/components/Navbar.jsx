import { Link, useNavigate, useLocation } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	useLocation(); // re-render on route changes to reflect auth state
	const token = sessionStorage.getItem("token");
	const email = sessionStorage.getItem("email");

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("email");
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
								<i className="fa-solid fa-user me-1"></i>{email}
							</span>
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
