import { useState, useEffect, useRef } from "react";

const POMODORO_TIEMPO = 25 * 60;

const Pomodoro = () => {
	const [segundos, setSegundos] = useState(POMODORO_TIEMPO);
	const [activo, setActivo] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		if (activo) {
			ref.current = setInterval(() => {
				setSegundos(s => {
					if (s <= 1) { clearInterval(ref.current); setActivo(false); return 0; }
					return s - 1;
				});
			}, 1000);
		} else {
			clearInterval(ref.current);
		}
		return () => clearInterval(ref.current);
	}, [activo]);

	const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
	const reiniciar = () => { setActivo(false); setSegundos(POMODORO_TIEMPO); };

	return (
		<div className="d-flex align-items-center gap-1 mt-2" onClick={e => e.stopPropagation()}>
			<i className="fa-solid fa-clock text-danger small"></i>
			<span className="fw-bold text-danger small">{fmt(segundos)}</span>
			<button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => setActivo(!activo)}>
				<i className={`fa-solid ${activo ? "fa-pause" : "fa-play"} small`}></i>
			</button>
			<button className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={reiniciar}>
				<i className="fa-solid fa-rotate-right small"></i>
			</button>
		</div>
	);
};

export const HabitoTile = ({ habito, registros = [], onMarcar, onClick, compact = false }) => {
	const hoy = new Date().toISOString().split("T")[0];
	const completadoHoy = registros.some(r => r.fecha === hoy && r.completado);
	const totalCompletados = registros.filter(r => r.completado).length;

	return (
		<div className={`card h-100 shadow-sm border-0 ${completadoHoy ? "border-start border-4 border-success" : ""}`}
			style={{ borderRadius: "16px", background: completadoHoy ? "#f0fff4" : "#fff", cursor: onClick ? "pointer" : "default", transition: "transform 0.15s, box-shadow 0.15s" }}
			onClick={onClick}
			onMouseEnter={onClick ? e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)"; } : undefined}
			onMouseLeave={onClick ? e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; } : undefined}>
			<div className="card-body p-3">
				<div className="d-flex justify-content-between align-items-start mb-1">
					<div className="flex-grow-1">
						{habito.categoria_nombre && (
							<span className={`badge bg-${habito.categoria_color || "primary"} mb-1`} style={{ fontSize: "0.7rem" }}>
								{habito.categoria_nombre}
							</span>
						)}
						<h6 className="card-title mb-0 fw-bold">{habito.nombre}</h6>
						{!compact && habito.descripcion && (
							<p className="text-muted small mb-0 mt-1">{habito.descripcion}</p>
						)}
					</div>
					<div className="ms-2 text-center">
						<button
							className={`btn btn-sm rounded-circle ${completadoHoy ? "btn-success" : "btn-outline-secondary"}`}
							style={{ width: "36px", height: "36px", padding: 0 }}
							onClick={e => { e.stopPropagation(); onMarcar && onMarcar(habito.id, hoy); }}
							title={completadoHoy ? "Completado hoy" : "Marcar como hecho"}>
							<i className={`fa-solid ${completadoHoy ? "fa-check" : "fa-circle"}`}></i>
						</button>
					</div>
				</div>

				<div className="d-flex align-items-center gap-2 mt-2">
					<span className="text-muted" style={{ fontSize: "0.75rem" }}>
						<i className="fa-solid fa-fire text-warning me-1"></i>
						{totalCompletados} día{totalCompletados !== 1 ? "s" : ""} completado{totalCompletados !== 1 ? "s" : ""}
					</span>
				</div>

				{!compact && <Pomodoro />}
			</div>
		</div>
	);
};
