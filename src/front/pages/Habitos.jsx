import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildAchievementStats, evaluateAchievements, saveUnlockedAchievements } from "../utils/achievements";

const COLORES = [
	{ valor: "primary", etiqueta: "Azul" },
	{ valor: "success", etiqueta: "Verde" },
	{ valor: "danger", etiqueta: "Rojo" },
	{ valor: "warning", etiqueta: "Amarillo" },
	{ valor: "info", etiqueta: "Celeste" },
	{ valor: "secondary", etiqueta: "Gris" },
	{ valor: "dark", etiqueta: "Negro" },
];

export const Habitos = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const filtroUrl = searchParams.get("filtro");
	const idDestacado = searchParams.get("id") ? parseInt(searchParams.get("id")) : null;
	const catFiltro = searchParams.get("cat") ? parseInt(searchParams.get("cat")) : null;
	const token = sessionStorage.getItem("token");
	const nombreUsuario = sessionStorage.getItem("nombre");

	const [habitos, setHabitos] = useState([]);
	const [categorias, setCategorias] = useState([]);
	const [registros, setRegistros] = useState({});
	const [busqueda, setBusqueda] = useState("");

	const [nombreHabito, setNombreHabito] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [categoriaId, setCategoriaId] = useState("");
	const [error, setError] = useState("");

	const [editandoId, setEditandoId] = useState(null);
	const [editNombre, setEditNombre] = useState("");
	const [editDescripcion, setEditDescripcion] = useState("");
	const [editCategoriaId, setEditCategoriaId] = useState("");

	const [fechaSeleccionada, setFechaSeleccionada] = useState({});

	const [nuevaCat, setNuevaCat] = useState("");
	const [nuevaCatColor, setNuevaCatColor] = useState("primary");
	const [errorCat, setErrorCat] = useState("");
	const [editandoCatId, setEditandoCatId] = useState(null);
	const [editCatNombre, setEditCatNombre] = useState("");
	const [editCatColor, setEditCatColor] = useState("primary");
	const [errorEditarCat, setErrorEditarCat] = useState("");
	const [nuevosLogros, setNuevosLogros] = useState([]);

	useEffect(() => {
		if (!token) { navigate("/login"); return; }
		cargarDatos();
	}, []);

	useEffect(() => {
		if (!idDestacado || habitos.length === 0) return;
		setTimeout(() => {
			const el = document.getElementById(`habito-${idDestacado}`);
			if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
		}, 400);
	}, [idDestacado, habitos]);

	useEffect(() => {
		if (nuevosLogros.length === 0) return;
		const timer = setTimeout(() => setNuevosLogros([]), 5000);
		return () => clearTimeout(timer);
	}, [nuevosLogros]);

	const headers = { Authorization: `Bearer ${token}` };

	const cargarDatos = async () => {
		const [rH, rC] = await Promise.all([
			fetch(import.meta.env.VITE_BACKEND_URL + "/api/habitos", { headers }),
			fetch(import.meta.env.VITE_BACKEND_URL + "/api/categorias", { headers }),
		]);
		if (rH.ok) {
			const data = await rH.json();
			setHabitos(data);
			data.forEach(h => cargarRegistros(h.id));
		}
		if (rC.ok) setCategorias(await rC.json());
	};

	const cargarRegistros = async (habitoId) => {
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${habitoId}/registros`, { headers });
		if (resp.ok) {
			const data = await resp.json();
			setRegistros(prev => ({ ...prev, [habitoId]: data }));
			return data;
		}
		return [];
	};

	const procesarNuevosLogros = (registrosActualizados) => {
		const identity = sessionStorage.getItem("email") || localStorage.getItem("email") || nombreUsuario || "usuario";
		const stats = buildAchievementStats(habitos, registrosActualizados);
		const achievements = evaluateAchievements(stats);
		const { newUnlocks } = saveUnlockedAchievements(identity, achievements);

		if (newUnlocks.length > 0) {
			setNuevosLogros(newUnlocks);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!nombreHabito.trim()) { setError("El nombre del hábito es requerido."); return; }
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/habitos", {
			method: "POST",
			headers: { ...headers, "Content-Type": "application/json" },
			body: JSON.stringify({ nombre: nombreHabito, descripcion, categoria_id: categoriaId || null }),
		});
		if (resp.ok) {
			const nuevo = await resp.json();
			setHabitos(prev => [...prev, nuevo]);
			setRegistros(prev => ({ ...prev, [nuevo.id]: [] }));
			setNombreHabito(""); setDescripcion(""); setCategoriaId("");
		} else {
			const data = await resp.json();
			setError(data.msg || "Error al crear el hábito.");
		}
	};

	const guardarEdicion = async (id) => {
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${id}`, {
			method: "PUT",
			headers: { ...headers, "Content-Type": "application/json" },
			body: JSON.stringify({ nombre: editNombre, descripcion: editDescripcion, categoria_id: editCategoriaId || null }),
		});
		if (resp.ok) {
			const actualizado = await resp.json();
			setHabitos(prev => prev.map(h => h.id === id ? actualizado : h));
			setEditandoId(null);
		}
	};

	const eliminarHabito = async (id, nombre) => {
		const confirmado = window.confirm(`¿Seguro que deseas eliminar el hábito "${nombre}"?`);
		if (!confirmado) return;

		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${id}`, {
			method: "DELETE",
			headers,
		});

		if (resp.ok) {
			setHabitos(prev => prev.filter(h => h.id !== id));
			setRegistros(prev => {
				const copia = { ...prev };
				delete copia[id];
				return copia;
			});
		}
	};

	const marcarFecha = async (habitoId) => {
		const hoy = new Date().toISOString().split("T")[0];
		const fecha = fechaSeleccionada[habitoId] || hoy;
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/habitos/${habitoId}/registro`, {
			method: "POST",
			headers: { ...headers, "Content-Type": "application/json" },
			body: JSON.stringify({ fecha }),
		});

		if (!resp.ok) return;

		const resultado = await resp.json();
		const registrosHabito = await cargarRegistros(habitoId);
		if (resultado.completado === false) return;

		procesarNuevosLogros({ ...registros, [habitoId]: registrosHabito });
	};

	const crearCategoria = async (e) => {
		e.preventDefault();
		setErrorCat("");
		if (!nuevaCat.trim()) { setErrorCat("El nombre es requerido."); return; }
		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/categorias", {
			method: "POST",
			headers: { ...headers, "Content-Type": "application/json" },
			body: JSON.stringify({ nombre: nuevaCat, color: nuevaCatColor }),
		});
		if (resp.ok) {
			const cat = await resp.json();
			setCategorias(prev => [...prev, cat]);
			setNuevaCat(""); setNuevaCatColor("primary");
		} else {
			setErrorCat("Error al crear la categoría.");
		}
	};

	const iniciarEdicionCategoria = (cat) => {
		setEditandoCatId(cat.id);
		setEditCatNombre(cat.nombre);
		setEditCatColor(cat.color || "primary");
		setErrorEditarCat("");
	};

	const cerrarModalEdicionCategoria = () => {
		setEditandoCatId(null);
		setEditCatNombre("");
		setEditCatColor("primary");
		setErrorEditarCat("");
	};

	const guardarEdicionCategoria = async (catId) => {
		setErrorEditarCat("");
		if (!editCatNombre.trim()) {
			setErrorEditarCat("El nombre es requerido.");
			return;
		}

		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/categorias/${catId}`, {
			method: "PUT",
			headers: { ...headers, "Content-Type": "application/json" },
			body: JSON.stringify({ nombre: editCatNombre, color: editCatColor }),
		});

		if (resp.ok) {
			const actualizada = await resp.json();
			setCategorias(prev => prev.map(c => c.id === catId ? actualizada : c));
			setHabitos(prev => prev.map(h =>
				h.categoria_id === catId
					? { ...h, categoria_nombre: actualizada.nombre, categoria_color: actualizada.color }
					: h
			));
			cerrarModalEdicionCategoria();
		} else {
			setErrorEditarCat("No se pudo actualizar la categoría.");
		}
	};

	const hoy = new Date().toISOString().split("T")[0];
	const estaCompletado = (habitoId, fecha) =>
		(registros[habitoId] || []).some(r => r.fecha === fecha && r.completado);

	// Filtered list (completados / pendientes / categoría específica)
	let habitosFiltrados = habitos.filter(h =>
		h.nombre.toLowerCase().includes(busqueda.toLowerCase())
	);
	let tituloFiltro = null;
	let iconoFiltro = "fa-filter";
	let colorFiltro = "secondary";

	if (filtroUrl === "completados") {
		habitosFiltrados = habitosFiltrados.filter(h =>
			(registros[h.id] || []).some(r => r.fecha === hoy && r.completado)
		);
		tituloFiltro = "Completados hoy";
		iconoFiltro = "fa-circle-check";
		colorFiltro = "success";
	} else if (filtroUrl === "pendientes") {
		habitosFiltrados = habitosFiltrados.filter(h =>
			!(registros[h.id] || []).some(r => r.fecha === hoy && r.completado)
		);
		tituloFiltro = "Pendientes hoy";
		iconoFiltro = "fa-circle";
		colorFiltro = "danger";
	} else if (filtroUrl === "categoria" && catFiltro) {
		habitosFiltrados = habitosFiltrados.filter(h => h.categoria_id === catFiltro);
		const cat = categorias.find(c => c.id === catFiltro);
		tituloFiltro = cat ? cat.nombre : "Categoría";
		iconoFiltro = "fa-folder";
		colorFiltro = cat?.color || "secondary";
	}

	const isFiltered = !!tituloFiltro;

	// Renders a single habit card (used in both normal and filtered views)
	const renderHabito = (h) => {
		const fechaH = fechaSeleccionada[h.id] || hoy;
		const completado = estaCompletado(h.id, fechaH);
		const diasCompletados = (registros[h.id] || []).filter(r => r.completado).length;

		return (
			<div key={h.id} id={`habito-${h.id}`} className="col-12 col-sm-6 col-lg-4">
				<div
					className={`card shadow-sm border-0 h-100 ${completado ? "border-start border-4 border-success" : ""}`}
					style={{
						borderRadius: "16px",
						background: completado ? "#f0fff4" : idDestacado === h.id ? "#fffde7" : "#fff",
						boxShadow: idDestacado === h.id ? "0 0 0 3px #f9a825" : "",
					}}>
					<div className="card-body p-3">
						{editandoId === h.id ? (
							<div>
								<input className="form-control mb-2" value={editNombre}
									onChange={e => setEditNombre(e.target.value)} placeholder="Nombre" />
								<textarea className="form-control mb-2" value={editDescripcion}
									onChange={e => setEditDescripcion(e.target.value)} rows={2} placeholder="Descripción" />
								<select className="form-select mb-2" value={editCategoriaId}
									onChange={e => setEditCategoriaId(e.target.value)}>
									<option value="">Sin categoría</option>
									{categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
								</select>
								<div className="d-flex gap-2">
									<button className="btn btn-sm btn-success" onClick={() => guardarEdicion(h.id)}>
										<i className="fa-solid fa-check me-1"></i>Guardar
									</button>
									<button className="btn btn-sm btn-outline-secondary" onClick={() => setEditandoId(null)}>
										Cancelar
									</button>
								</div>
							</div>
						) : (
							<>
								<div className="d-flex justify-content-between align-items-start mb-2">
									<div className="flex-grow-1">
										{h.categoria_nombre && (
											<span className={`badge bg-${h.categoria_color || "secondary"} mb-1`} style={{ fontSize: "0.7rem" }}>
												{h.categoria_nombre}
											</span>
										)}
										<h6 className="fw-bold mb-0">{h.nombre}</h6>
										{h.descripcion && <p className="text-muted small mb-0 mt-1">{h.descripcion}</p>}
									</div>
									<button className="btn btn-sm btn-outline-primary ms-2" onClick={() => {
										setEditandoId(h.id);
										setEditNombre(h.nombre);
										setEditDescripcion(h.descripcion || "");
										setEditCategoriaId(h.categoria_id || "");
									}}>
										<i className="fa-solid fa-pen"></i>
									</button>
									<button
										className="btn btn-sm btn-outline-danger ms-1"
										onClick={() => eliminarHabito(h.id, h.nombre)}>
										<i className="fa-solid fa-trash"></i>
									</button>
								</div>

								<div className="d-flex align-items-center gap-2 flex-wrap">
									<input type="date" className="form-control form-control-sm" style={{ width: "150px" }}
										max={hoy} value={fechaH}
										onChange={e => setFechaSeleccionada(prev => ({ ...prev, [h.id]: e.target.value }))} />
									<button
										className={`btn btn-sm ${completado ? "btn-success" : "btn-outline-success"}`}
										onClick={() => marcarFecha(h.id)}>
										<i className={`fa-solid ${completado ? "fa-circle-check" : "fa-circle"} me-1`}></i>
										{completado ? "Hecho" : "Marcar"}
									</button>
								</div>

								<div className="mt-2 d-flex align-items-center justify-content-between">
									<small className="text-muted">
										<i className="fa-solid fa-fire text-warning me-1"></i>
										{diasCompletados} día{diasCompletados !== 1 ? "s" : ""} completado{diasCompletados !== 1 ? "s" : ""}
									</small>
									<button
										className="btn btn-link btn-sm text-muted p-0"
										style={{ fontSize: "0.75rem" }}
										onClick={() => navigate("/historial")}>
										Ver historial
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		);
	};

	// Group habits by category for the normal view
	const renderPorCategoria = (lista) => {
		const resultado = [];

		categorias.forEach(cat => {
			const habitosCat = lista.filter(h => h.categoria_id === cat.id);
			if (habitosCat.length === 0) return;
			resultado.push(
				<div key={cat.id} className="mb-4">
					<div className="d-flex align-items-center gap-2 mb-2">
						<span className={`badge bg-${cat.color} fs-6 px-3 py-2`} style={{ borderRadius: "12px" }}>
							<i className="fa-solid fa-folder me-2"></i>{cat.nombre}
						</span>
						<span className="text-muted small">{habitosCat.length} hábito{habitosCat.length !== 1 ? "s" : ""}</span>
					</div>
					<div className="row g-3">
						{habitosCat.map(h => renderHabito(h))}
					</div>
				</div>
			);
		});

		const sinCat = lista.filter(h => !h.categoria_id);
		if (sinCat.length > 0) {
			resultado.push(
				<div key="sin-cat" className="mb-4">
					<div className="d-flex align-items-center gap-2 mb-2">
						<span className="badge bg-secondary fs-6 px-3 py-2" style={{ borderRadius: "12px" }}>
							<i className="fa-solid fa-inbox me-2"></i>Sin categoría
						</span>
						<span className="text-muted small">{sinCat.length} hábito{sinCat.length !== 1 ? "s" : ""}</span>
					</div>
					<div className="row g-3">
						{sinCat.map(h => renderHabito(h))}
					</div>
				</div>
			);
		}

		return resultado;
	};

	return (
		<div className="container mt-4 pb-4 position-relative">
			{nuevosLogros.length > 0 && (
				<div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
					<div
						className="toast show border-0 shadow"
						role="alert"
						aria-live="assertive"
						aria-atomic="true"
						style={{ borderRadius: "16px", minWidth: "320px", background: "linear-gradient(135deg, #fff7e6 0%, #eafaf1 100%)" }}>
						<div className="toast-header border-0" style={{ background: "transparent" }}>
							<i className="fa-solid fa-trophy text-warning me-2"></i>
							<strong className="me-auto">¡Medalla desbloqueada!</strong>
							<small className="text-muted">Ahora</small>
							<button type="button" className="btn-close ms-2" aria-label="Close" onClick={() => setNuevosLogros([])}></button>
						</div>
						<div className="toast-body pt-0">
							<div className="small mb-2">{nuevosLogros.map(logro => logro.titulo).join(", ")}</div>
							<div className="d-flex gap-2">
								<button className="btn btn-sm btn-outline-success" onClick={() => navigate("/reconocimientos")}>
									Ver insignias
								</button>
								<button className="btn btn-sm btn-success" onClick={() => setNuevosLogros([])}>
									Cerrar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Header */}
			<div className="d-flex justify-content-between align-items-center mb-1">
				<div className="d-flex align-items-center gap-3">
					{isFiltered && (
						<button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/habitos")}>
							<i className="fa-solid fa-arrow-left me-1"></i>Volver
						</button>
					)}
					<h2 className="mb-0">
						<i className="fa-solid fa-list-check me-2 text-primary"></i>
						{isFiltered ? (
							<span>
								<span className={`badge bg-${colorFiltro} me-2`} style={{ fontSize: "1rem" }}>
									<i className={`fa-solid ${iconoFiltro} me-1`}></i>{tituloFiltro}
								</span>
							</span>
						) : "Mis Hábitos"}
					</h2>
				</div>
				{!isFiltered && (
					<button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/historial")}>
						<i className="fa-solid fa-calendar-check me-1"></i>Ver historial
					</button>
				)}
			</div>
			<p className="text-muted mb-3">Hola, {nombreUsuario}</p>

			{/* Creation forms — only in the main (non-filtered) view */}
			{!isFiltered && (
				<div className="row g-4 mb-4">
					<div className="col-12 col-md-6">
						<div className="card shadow-sm border-0 p-4" style={{ borderRadius: "16px" }}>
							<h5 className="mb-3"><i className="fa-solid fa-plus me-2 text-primary"></i>Nuevo hábito</h5>
							{error && <div className="alert alert-danger">{error}</div>}
							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label className="form-label">Nombre</label>
									<input type="text" className="form-control" placeholder="Ej: Leer 30 minutos"
										value={nombreHabito} onChange={e => setNombreHabito(e.target.value)} />
								</div>
								<div className="mb-3">
									<label className="form-label">Descripción</label>
									<textarea className="form-control" placeholder="Ej: Leer antes de dormir"
										value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} />
								</div>
								<div className="mb-3">
									<label className="form-label">Categoría</label>
									<select className="form-select" value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
										<option value="">Sin categoría</option>
										{categorias.map(c => (
											<option key={c.id} value={c.id}>{c.nombre}</option>
										))}
									</select>
								</div>
								<button type="submit" className="btn btn-primary w-100">
									<i className="fa-solid fa-plus me-2"></i>Agregar hábito
								</button>
							</form>
						</div>
					</div>

					<div className="col-12 col-md-6">
						<div className="card shadow-sm border-0 p-4" style={{ borderRadius: "16px" }}>
							<h5 className="mb-3"><i className="fa-solid fa-folder-plus me-2 text-warning"></i>Nueva categoría</h5>
							{errorCat && <div className="alert alert-danger">{errorCat}</div>}
							<form onSubmit={crearCategoria}>
								<div className="mb-3">
									<label className="form-label">Nombre de la categoría</label>
									<input type="text" className="form-control" placeholder="Ej: Salud, Trabajo..."
										value={nuevaCat} onChange={e => setNuevaCat(e.target.value)} />
								</div>
								<div className="mb-3">
									<label className="form-label">Color</label>
									<div className="d-flex gap-2 flex-wrap">
										{COLORES.map(c => (
											<button key={c.valor} type="button"
												className={`btn btn-${c.valor} btn-sm ${nuevaCatColor === c.valor ? "border border-dark border-3" : ""}`}
												style={{ width: "32px", height: "32px", borderRadius: "50%", padding: 0 }}
												onClick={() => setNuevaCatColor(c.valor)}
												title={c.etiqueta} />
										))}
									</div>
								</div>
								<button type="submit" className="btn btn-warning w-100 fw-bold">
									<i className="fa-solid fa-plus me-2"></i>Crear categoría
								</button>
							</form>
							{categorias.length > 0 && (
								<div className="mt-3">
									<div className="small text-muted mb-2">Categorías registradas</div>
									{errorEditarCat && <div className="alert alert-danger py-2 mb-2">{errorEditarCat}</div>}
									<div className="d-flex flex-row gap-2">
										{categorias.map(c => (
											<div key={c.id} className="d-flex align-items-center gap-2 flex-wrap">
												<span className={`badge bg-${c.color} px-3 py-2`} style={{ borderRadius: "12px", fontSize: "0.85rem" }}>
													{c.nombre}
												</span>
												<button
													className="btn btn-sm btn-outline-primary p-1"
													title="Editar categoría"
													onClick={() => iniciarEdicionCategoria(c)}>
													<i className="fa-solid fa-pen"></i>
												</button>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Search bar */}
			<div className="mb-4">
				<input type="text" className="form-control" placeholder="🔍 Buscar hábito por nombre..."
					value={busqueda} onChange={e => setBusqueda(e.target.value)} />
			</div>

			{/* Filtered view: flat list */}
			{isFiltered ? (
				<>
					{habitosFiltrados.length === 0 ? (
						<div className="text-center mt-5">
							<i className="fa-solid fa-inbox text-muted mb-3" style={{ fontSize: "2.5rem" }}></i>
							<p className="text-muted fs-5">No hay hábitos en esta vista.</p>
						</div>
					) : (
						<div className="row g-3">
							{habitosFiltrados.map(h => renderHabito(h))}
						</div>
					)}
				</>
			) : (
				/* Normal view: grouped by category */
				<>
					{habitos.length === 0 ? (
						<div className="text-center mt-5">
							<i className="fa-solid fa-seedling text-success mb-3" style={{ fontSize: "2.5rem" }}></i>
							<p className="text-muted fs-5">Aún no tienes hábitos. ¡Crea el primero!</p>
						</div>
					) : (
						renderPorCategoria(
							habitos.filter(h => h.nombre.toLowerCase().includes(busqueda.toLowerCase()))
						)
					)}
				</>
			)}

			{editandoCatId !== null && (
				<>
					<div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
						<div className="modal-dialog modal-dialog-centered" role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">Editar categoría</h5>
									<button type="button" className="btn-close" aria-label="Close" onClick={cerrarModalEdicionCategoria}></button>
								</div>
								<div className="modal-body">
									{errorEditarCat && <div className="alert alert-danger py-2">{errorEditarCat}</div>}
									<div className="mb-3">
										<label className="form-label">Nombre</label>
										<input
											type="text"
											className="form-control"
											value={editCatNombre}
											onChange={e => setEditCatNombre(e.target.value)}
										/>
									</div>
									<div>
										<label className="form-label">Color</label>
										<select
											className="form-select"
											value={editCatColor}
											onChange={e => setEditCatColor(e.target.value)}>
											{COLORES.map(color => (
												<option key={color.valor} value={color.valor}>{color.etiqueta}</option>
											))}
										</select>
									</div>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-outline-secondary" onClick={cerrarModalEdicionCategoria}>
										Cancelar
									</button>
									<button type="button" className="btn btn-primary" onClick={() => guardarEdicionCategoria(editandoCatId)}>
										Guardar cambios
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="modal-backdrop fade show"></div>
				</>
			)}
		</div>
	);
};