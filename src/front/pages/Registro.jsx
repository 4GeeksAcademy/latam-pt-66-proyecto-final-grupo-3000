import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AuthShell } from "../components/AuthShell.jsx";

export const Registro = () => {
	const { dispatch } = useGlobalReducer();
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleRegistro = async (e) => {
		e.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden");
			return;
		}

		const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/registro", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ nombre, apellido, email, password })
		});

		if (response.ok) {
			const data = await response.json();
			sessionStorage.setItem("token", data.token);
			sessionStorage.setItem("nombre", data.nombre);
			dispatch({ type: "change_plan", payload: data.plan || "free" });
			navigate("/habitos");
		} else {
			const data = await response.json();
			setError(data.msg || "Error al registrarse");
		}
	};

	return (
		<AuthShell
			pageClassName="main_registro auth-page auth-page--registro"
			panelIcon="fa-solid fa-user-plus"
			panelTitle="¡Crea tu cuenta!"
			panelText="Regístrate para comenzar a registrar tus hábitos y seguir tu progreso."
			formTitle="Crear cuenta"
			formSubtitle="Completa tus datos para continuar"
			panelClassName="auth-panel--registro"
			reverse={true}
		>
			{error && <div className="alert alert-danger border-0">{error}</div>}

			<form onSubmit={handleRegistro}>
				<div className="mb-3">
					<label className="form-label">Nombre</label>
					<input
						type="text"
						className="form-control"
						value={nombre}
						onChange={e => setNombre(e.target.value)}
						placeholder="Tu nombre"
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Apellido</label>
					<input
						type="text"
						className="form-control"
						value={apellido}
						onChange={e => setApellido(e.target.value)}
						placeholder="Tu apellido"
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Correo electrónico</label>
					<input
						type="email"
						className="form-control"
						value={email}
						onChange={e => setEmail(e.target.value)}
						placeholder="correo@ejemplo.com"
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Contraseña</label>
					<input
						type="password"
						className="form-control"
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder="Mínimo 6 caracteres"
						minLength={6}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Confirmar Contraseña</label>
					<input
						type="password"
						className="form-control"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						placeholder="Repite tu contraseña"
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary login-btn w-100 text-white">
					Registrarse
				</button>
			</form>

			<p className="text-center mt-4 mb-0 small text-muted">
				¿Ya tienes cuenta?
				<Link to="/login" className="text-primary fw-bold ms-1 auth-link">
					Inicia sesión
				</Link>
			</p>
		</AuthShell>
	);
};

