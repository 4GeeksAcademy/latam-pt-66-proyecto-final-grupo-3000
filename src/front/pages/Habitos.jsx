import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Habitos = () => {
	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");
	const email = sessionStorage.getItem("email");

	useEffect(() => {
		if (!token) navigate("/login");
	}, []);

	return (
		<div className="container mt-5">
			<h2><i className="fa-solid fa-list-check me-2 text-primary"></i>Mis Hábitos</h2>
			<p className="text-muted">Bienvenido, {email}</p>
		</div>
	);
};
