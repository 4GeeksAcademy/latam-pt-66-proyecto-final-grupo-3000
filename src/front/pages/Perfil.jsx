import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HabitoTile } from "../components/HabitoTile";

export const Perfil = () => {
	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");

	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [exito, setExito] = useState("");
	const [habitos, setHabitos] = useState([]);
	const [registros, setRegistros] = useState({});

	useEffect(() => {
		if (!token) { navigate("/login"); return; }
		const headers = { Authorization: `Bearer ${token}` };
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/perfil", { headers })
			.then(r => r.json())
			.then(data => { setNombre(data.nombre || ""); setApellido(data.apellido || ""); });
		fetch(import.meta.env.VITE_BACKEND_URL + "/api/habitos", { headers })
			.then(r => r.json())
			.then(data => {
				setHabitos(data);
				data.forEach(h => cargarRegistros(h.id));
			});
	}, []);

	const cargarRegistros = async (habitoId) => {
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${habitoId}/registros`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (resp.ok) {
			const data = await resp.json();
			setRegistros(prev => ({ ...prev, [habitoId]: data }));
		}
	};

	const marcarHoy = async (habitoId, fecha) => {
		await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${habitoId}/registro`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify({ fecha }),
		});
		cargarRegistros(habitoId);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(""); setExito("");
		if (password && password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
		const body = { nombre, apellido };
		if (password) body.password = password;
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/perfil", {
			method: "PUT",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
			body: JSON.stringify(body),
		});
		if (resp.ok) {
			const data = await resp.json();
			sessionStorage.setItem("nombre", data.nombre);
			setExito("Perfil actualizado correctamente.");
			setPassword(""); setConfirmPassword("");
		} else {
			const data = await resp.json();
			setError(data.msg || "Error al actualizar el perfil.");
		}
	};

	const hoy = new Date().toISOString().split("T")[0];
	const completadosHoy = habitos.filter(h => (registros[h.id] || []).some(r => r.fecha === hoy && r.completado)).length;

	return (
		<div className="container mt-4 pb-4">
			<div className="row g-4">
				<div className="col-12 col-md-5">
					<div className="card shadow border-0 h-100" style={{ borderRadius: "20px" }}>
						<div className="card-body p-4">
							<h4 className="mb-4">
								<i className="fa-solid fa-user-gear me-2 text-primary"></i>Mi Perfil
							</h4>
							{error && <div className="alert alert-danger">{error}</div>}
							{exito && <div className="alert alert-success">{exito}</div>}
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label className="form-label fw-semibold">Nombre</label>
									<input type="text" className="form-control" value={nombre}
										onChange={e => setNombre(e.target.value)} required />
								</div>
								<div className="mb-3">
									<label className="form-label fw-semibold">Apellido</label>
									<input type="text" className="form-control" value={apellido}
										onChange={e => setApellido(e.target.value)} required />
								</div>
								<hr />
								<p className="text-muted small">Deja en blanco si no deseas cambiar la contraseña.</p>
								<div className="mb-3">
									<label className="form-label fw-semibold">Nueva contraseña</label>
									<input type="password" className="form-control" value={password}
										onChange={e => setPassword(e.target.value)} placeholder="Nueva contraseña" />
								</div>
								<div className="mb-3">
									<label className="form-label fw-semibold">Confirmar contraseña</label>
									<input type="password" className="form-control" value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)} placeholder="Repite la contraseña" />
								</div>
								<div className="d-flex gap-2">
									<button type="submit" className="btn btn-primary">Guardar cambios</button>
									<button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/habitos")}>Volver</button>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="col-12 col-md-7">
					<div className="card shadow border-0 h-100" style={{ borderRadius: "20px" }}>
						<div className="card-body p-4">
							<h5 className="mb-1">
								<i className="fa-solid fa-chart-simple me-2 text-primary"></i>Resumen de hábitos
							</h5>
							<p className="text-muted small mb-3">
								{completadosHoy} de {habitos.length} completados hoy
							</p>
							{habitos.length === 0 ? (
								<div className="text-center text-muted mt-4">
									<i className="fa-solid fa-seedling mb-2" style={{ fontSize: "2rem" }}></i>
									<p>Aún no tienes hábitos registrados.</p>
									<button className="btn btn-primary btn-sm" onClick={() => navigate("/habitos")}>
										Crear hábito
									</button>
								</div>
							) : (
								<div className="row g-3">
									{habitos.map(h => (
										<div key={h.id} className="col-12 col-sm-6">
											<HabitoTile habito={h} registros={registros[h.id] || []} onMarcar={marcarHoy} compact />
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
