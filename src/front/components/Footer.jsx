import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="py-3 bg-primary text-white text-center mt-5">
		<div className="container">
			<span className="me-3">
				<i className="fa-solid fa-list-check me-1"></i>
				<strong>Habit Tracker</strong> &copy; {new Date().getFullYear()}
			</span>
			<span>Construye mejores hábitos, un día a la vez.</span>
			<div className="mt-4 d-flex justify-content-center gap-3">
				<Link to="/acercade" className="btn btn-outline-light btn-sm rounded-pill px-0" style={{ width: "100px" }}>
					Acerca de
				</Link>

				<Link to="/ayuda" className="btn btn-outline-light btn-sm rounded-pill px-0" style={{ width: "100px" }}>
					Ayuda
				</Link>


			</div>
		</div>
	</footer>
);
