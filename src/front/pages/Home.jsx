import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			if (!backendUrl) throw new Error("VITE_BACKEND_URL undefined");

			const response = await fetch(backendUrl + "/api/hello");
			const data = await response.json();

			if (response.ok) dispatch({ type: "set_hello", payload: data.message });
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		loadMessage();
	}, []);

	return (
		<div className="home-container p-3">
			<div className="home-card text-center">
				<div className="icon-circle rounded-circle">
					<i className="fa-solid fa-leaf text-white fs-1"></i>
				</div>

				<h1 className="fw-bold text-dark mb-2">Habit Tracker</h1>
				<p className="text-muted mb-4">Gestiona tus hábitos de forma rápida y sencilla.</p>

				<div className="mt-4 pt-3 border-top">
					{store.message ? (
						<div className="badge rounded-pill bg-success-subtle text-success p-2 px-3">
							<i className="fa-solid fa-check-circle me-2"></i>
							{store.message}
						</div>
					) : (
						<div className="badge rounded-pill bg-warning-subtle text-warning p-2 px-3">
							<span className="spinner-border spinner-border-sm me-2" role="status"></span>
							Conectando con el servidor...
						</div>
					)}
				</div>

				<button
					className="btn btn-primary login-btn w-100 mt-4 text-white py-2"
					onClick={() => navigate("/login")}
				>
					Comenzar ahora
				</button>
				<p>
					Registrate Gratis
					<span className="text-primary fw-bold ms-1" style={{ cursor: "pointer" }} onClick={() => navigate("/registro")}>
						Aquí
					</span>
				</p>
			</div>
		</div>
	);
};
