import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Historial = () => {
	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");

	const [habitos, setHabitos] = useState([]);
	const [registros, setRegistros] = useState({});
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
		if (!token) { navigate("/login"); return; }
		cargarDatos();
	}, []);

	const headers = { Authorization: `Bearer ${token}` };

	const cargarDatos = async () => {
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/habitos", { headers });
		if (resp.ok) {
			const data = await resp.json();
			setHabitos(data);
			await Promise.all(data.map(h => cargarRegistros(h.id)));
		}
		setCargando(false);
	};

	const cargarRegistros = async (habitoId) => {
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${habitoId}/registros`, { headers });
		if (resp.ok) {
			const data = await resp.json();
			setRegistros(prev => ({ ...prev, [habitoId]: data }));
		}
	};

	// Build date-based index: { "2025-04-20": [{ habito, registro }, ...] }
	const byDate = {};
	habitos.forEach(h => {
		(registros[h.id] || [])
			.filter(r => r.completado)
			.forEach(r => {
				if (!byDate[r.fecha]) byDate[r.fecha] = [];
				byDate[r.fecha].push({ habito: h, registro: r });
			});
	});

	const fechas = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

	const totalRegistros = fechas.reduce((acc, f) => acc + byDate[f].length, 0);
	const rachaActual = (() => {
		const hoy = new Date();
		let racha = 0;
		for (let i = 0; i < 365; i++) {
			const d = new Date(hoy);
			d.setDate(d.getDate() - i);
			const fecha = d.toISOString().split("T")[0];
			if (byDate[fecha] && byDate[fecha].length > 0) racha++;
			else break;
		}
		return racha;
	})();

	if (cargando) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Cargando...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container mt-4 pb-4">
			{/* Header */}
			<div className="d-flex align-items-center gap-3 mb-4">
				<button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/habitos")}>
					<i className="fa-solid fa-arrow-left me-1"></i>Volver
				</button>
				<h2 className="mb-0">
					<i className="fa-solid fa-calendar-check me-2 text-primary"></i>Historial
				</h2>
			</div>

			{/* Summary stats */}
			<div className="row g-3 mb-4">
				<div className="col-6 col-md-3">
					<div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px", background: "#e8f0fe" }}>
						<div className="fs-2 fw-bold text-primary">{habitos.length}</div>
						<div className="text-muted small">Hábitos registrados</div>
					</div>
				</div>
				<div className="col-6 col-md-3">
					<div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px", background: "#e6f4ea" }}>
						<div className="fs-2 fw-bold text-success">{totalRegistros}</div>
						<div className="text-muted small">Total completados</div>
					</div>
				</div>
				<div className="col-6 col-md-3">
					<div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px", background: "#fff8e1" }}>
						<div className="fs-2 fw-bold text-warning">{rachaActual}</div>
						<div className="text-muted small">Días de racha</div>
					</div>
				</div>
				<div className="col-6 col-md-3">
					<div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: "16px", background: "#fce8e6" }}>
						<div className="fs-2 fw-bold text-danger">{fechas.length}</div>
						<div className="text-muted small">Días activos</div>
					</div>
				</div>
			</div>

			{/* Timeline */}
			{fechas.length === 0 ? (
				<div className="text-center mt-5">
					<i className="fa-solid fa-calendar-xmark text-muted mb-3" style={{ fontSize: "3rem" }}></i>
					<p className="text-muted fs-5">No hay registros aún.</p>
					<button className="btn btn-primary" onClick={() => navigate("/habitos")}>
						Ir a mis hábitos
					</button>
				</div>
			) : (
				<div>
					{fechas.map(fecha => (
						<div key={fecha} className="mb-4">
							<div className="d-flex align-items-center gap-2 mb-2">
								<span className="badge bg-primary px-3 py-2" style={{ borderRadius: "12px", fontSize: "0.9rem" }}>
									<i className="fa-solid fa-calendar-day me-2"></i>{fecha}
								</span>
								<span className="text-muted small">
									{byDate[fecha].length} hábito{byDate[fecha].length !== 1 ? "s" : ""} completado{byDate[fecha].length !== 1 ? "s" : ""}
								</span>
							</div>
							<div className="row g-2">
								{byDate[fecha].map(({ habito, registro }) => (
									<div key={registro.id} className="col-12 col-sm-6 col-md-4">
										<div
											className="card border-0 shadow-sm"
											style={{ borderRadius: "12px", background: "#f0fff4", cursor: "pointer" }}
											onClick={() => navigate(`/habitos?id=${habito.id}`)}>
											<div className="card-body p-3 d-flex align-items-center gap-3">
												<i className="fa-solid fa-circle-check text-success fs-5 flex-shrink-0"></i>
												<div className="overflow-hidden">
													{habito.categoria_nombre && (
														<span
															className={`badge bg-${habito.categoria_color || "secondary"} mb-1`}
															style={{ fontSize: "0.65rem" }}>
															{habito.categoria_nombre}
														</span>
													)}
													<div className="fw-bold small text-truncate">{habito.nombre}</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
