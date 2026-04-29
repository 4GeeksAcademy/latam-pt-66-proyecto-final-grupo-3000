import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HabitoTile } from "../components/HabitoTile";

export const Home = () => {
	const navigate = useNavigate();
	const token = sessionStorage.getItem("token") || localStorage.getItem("token");
	const nombreUsuario = sessionStorage.getItem("nombre") || localStorage.getItem("nombre");

	const [habitos, setHabitos] = useState([]);
	const [categorias, setCategorias] = useState([]);
	const [registros, setRegistros] = useState({});

	useEffect(() => {
		if (!token) return;
		cargarDatos();
	}, []);

	const cargarDatos = async () => {
		const headers = { Authorization: `Bearer ${token}` };
		const [rHabitos, rCategorias] = await Promise.all([
			fetch(import.meta.env.VITE_BACKEND_URL + "/api/habitos", { headers }),
			fetch(import.meta.env.VITE_BACKEND_URL + "/api/categorias", { headers }),
		]);
		if (rHabitos.ok) {
			const data = await rHabitos.json();
			setHabitos(data);
			data.forEach(h => cargarRegistros(h.id, headers));
		}
		if (rCategorias.ok) setCategorias(await rCategorias.json());
	};

	const cargarRegistros = async (habitoId, headers) => {
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${habitoId}/registros`, { headers });
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
		cargarRegistros(habitoId, { Authorization: `Bearer ${token}` });
	};

	if (!token) {
		return (
			<div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-3"
				style={{ background: "linear-gradient(135deg, #1a73e8 0%, #004ba0 100%)" }}>
				<i className="fa-solid fa-list-check text-white mb-3" style={{ fontSize: "4rem" }}></i>
				<h1 className="text-white fw-bold display-5">Habit Tracker</h1>
				<p className="text-white opacity-75 fs-5 mb-4">Construye mejores hábitos, un día a la vez.</p>
				<div className="d-flex gap-3">
					<button className="btn btn-light btn-lg px-4 fw-bold" onClick={() => navigate("/registro")}>
						Comenzar gratis
					</button>
					<button className="btn btn-outline-light btn-lg px-4" onClick={() => navigate("/login")}>
						Iniciar sesión
					</button>
				</div>
			</div>
		);
	}

	const hoy = new Date().toISOString().split("T")[0];
	const completadosHoy = habitos.filter(h =>
		(registros[h.id] || []).some(r => r.fecha === hoy && r.completado)
	).length;
	const sinCategoria = habitos.filter(h => !h.categoria_id);

	const statTiles = [
		{ valor: habitos.length, etiqueta: "Hábitos activos", bg: "#e8f0fe", color: "text-primary", filtro: "todos" },
		{ valor: completadosHoy, etiqueta: "Completados hoy", bg: "#e6f4ea", color: "text-success", filtro: "completados" },
		{ valor: habitos.length - completadosHoy, etiqueta: "Pendientes hoy", bg: "#fce8e6", color: "text-danger", filtro: "pendientes" },
		{ valor: categorias.length, etiqueta: "Categorías", bg: "#fff8e1", color: "text-warning", filtro: "categorias" },
	];

	return (
		<div className="container-fluid px-4 mt-4 pb-4">
			<div className="mb-4">
				<h2 className="fw-bold">Hola, {nombreUsuario} 👋</h2>
				<p className="text-muted mb-0">
					Hoy completaste <strong>{completadosHoy}</strong> de <strong>{habitos.length}</strong> hábito{habitos.length !== 1 ? "s" : ""}.
				</p>
			</div>

			<div className="row g-3 mb-4">
				{statTiles.map(({ valor, etiqueta, bg, color, filtro }) => (
					<div key={etiqueta} className="col-6 col-md-3">
						<div
							className="card border-0 shadow-sm text-center p-3"
							style={{ borderRadius: "16px", background: bg, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
							onClick={() => navigate(`/habitos?filtro=${filtro}`)}
							onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)"; }}
							onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
							<div className={`fs-1 fw-bold ${color}`}>{valor}</div>
							<div className="text-muted small">{etiqueta}</div>
						</div>
					</div>
				))}
			</div>

			{categorias.map(cat => {
				const habitosCat = habitos.filter(h => h.categoria_id === cat.id);
				if (habitosCat.length === 0) return null;
				return (
					<div key={cat.id} className="mb-4">
						<div className="d-flex align-items-center gap-2 mb-2">
							<span
								className={`badge bg-${cat.color} fs-6 px-3 py-2`}
								style={{ borderRadius: "12px", cursor: "pointer" }}
								onClick={() => navigate(`/habitos?filtro=categoria&cat=${cat.id}`)}>
								<i className="fa-solid fa-folder me-2"></i>{cat.nombre}
							</span>
							<span className="text-muted small">{habitosCat.length} hábito{habitosCat.length !== 1 ? "s" : ""}</span>
						</div>
						<div className="row g-3">
							{habitosCat.map(h => (
								<div key={h.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
									<HabitoTile
										habito={h}
										registros={registros[h.id] || []}
										onMarcar={marcarHoy}
										onClick={() => navigate(`/habitos?id=${h.id}`)} />
								</div>
							))}
						</div>
					</div>
				);
			})}

			{sinCategoria.length > 0 && (
				<div className="mb-4">
					<div className="d-flex align-items-center gap-2 mb-2">
						<span className="badge bg-secondary fs-6 px-3 py-2" style={{ borderRadius: "12px" }}>
							<i className="fa-solid fa-inbox me-2"></i>Sin categoría
						</span>
						<span className="text-muted small">{sinCategoria.length} hábito{sinCategoria.length !== 1 ? "s" : ""}</span>
					</div>
					<div className="row g-3">
						{sinCategoria.map(h => (
							<div key={h.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
								<HabitoTile
									habito={h}
									registros={registros[h.id] || []}
									onMarcar={marcarHoy}
									onClick={() => navigate(`/habitos?id=${h.id}`)} />
							</div>
						))}
					</div>
				</div>
			)}

			{habitos.length === 0 && (
				<div className="text-center mt-5">
					<i className="fa-solid fa-seedling text-success mb-3" style={{ fontSize: "3rem" }}></i>
					<p className="text-muted fs-5">Aún no tienes hábitos.</p>
					<button className="btn btn-primary mt-2" onClick={() => navigate("/habitos")}>
						Crear mi primer hábito
					</button>
				</div>
			)}
		</div>
	);
};
