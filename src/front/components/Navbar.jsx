import { Link } from "react-router-dom";

export const Navbar = () => {
	const token = sessionStorage.getItem("token") ? "Logout" : "Login";
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/login">
						<button className="btn btn-primary me-2"><i className="fa-solid fa-right-to-bracket"></i> {token}</button>
					</Link>
				</div>

			</div>
		</nav>
	);
};