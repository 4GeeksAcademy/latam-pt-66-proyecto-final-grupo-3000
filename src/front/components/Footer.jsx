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
				<Link to="/quienes-somos" className="btn btn-outline-light btn-sm rounded-pill" style={{ width: "150px", paddingTop: "13px" }}>
					¿Quiénes somos?
				</Link>
				<Link to="/acercade" className="btn btn-outline-light btn-sm rounded-pill" style={{ width: "150px", paddingTop: "13px" }}>
					Sobre Habit Tracker
				</Link>
				<Link to="/faq" className="btn btn-outline-light btn-sm rounded-pill" style={{ width: "150px" }}>
					Preguntas Frecuentes
				</Link>


			</div>
		</div>
	</footer>
);
