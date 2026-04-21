import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Registro = () => {
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
			navigate("/habitos");
		} else {
			const data = await response.json();
			setError(data.msg || "Error al registrarse");
		}
	};

	return (
		<div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
			<div className="card shadow" style={{ width: "100%", maxWidth: "420px" }}>
				<div className="card-body p-4">
					<h3 className="card-title text-center mb-4">
						<i className="fa-solid fa-user-plus me-2 text-primary"></i>Crear Cuenta
					</h3>
					{error && <div className="alert alert-danger">{error}</div>}
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
						<button type="submit" className="btn btn-primary w-100">
							Registrarse
						</button>
					</form>
					<p className="text-center mt-3 mb-0">
						¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
