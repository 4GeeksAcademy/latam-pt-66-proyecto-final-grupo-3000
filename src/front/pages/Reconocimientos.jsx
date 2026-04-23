import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    buildAchievementStats,
    calculateAchievementStars,
    evaluateAchievements,
    getSavedAchievements,
    MAX_STARS,
    saveUnlockedAchievements,
} from "../utils/achievements";

export const Reconocimientos = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const identity = sessionStorage.getItem("email") || localStorage.getItem("email") || "usuario";

    const [habitos, setHabitos] = useState([]);
    const [registros, setRegistros] = useState({});
    const [cargando, setCargando] = useState(true);

    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const cargarDatos = async () => {
            setCargando(true);
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/habitos", { headers });
            if (!resp.ok) {
                setCargando(false);
                return;
            }

            const dataHabitos = await resp.json();
            setHabitos(dataHabitos);

            const detalleRegistros = await Promise.all(
                dataHabitos.map(async (habito) => {
                    const registrosResp = await fetch(
                        import.meta.env.VITE_BACKEND_URL + `/api/habitos/${habito.id}/registros`,
                        { headers }
                    );
                    if (!registrosResp.ok) return [habito.id, []];
                    return [habito.id, await registrosResp.json()];
                })
            );

            setRegistros(Object.fromEntries(detalleRegistros));
            setCargando(false);
        };

        cargarDatos();
    }, [headers, navigate, token]);

    const stats = useMemo(() => buildAchievementStats(habitos, registros), [habitos, registros]);

    const achievements = useMemo(() => {
        const evaluados = evaluateAchievements(stats);
        const saved = new Map(getSavedAchievements(identity).map((item) => [item.id, item]));

        return evaluados.map((achievement) => {
            const persistido = saved.get(achievement.id);
            return {
                ...achievement,
                desbloqueado: achievement.desbloqueado || !!persistido,
                unlockedAt: persistido?.unlockedAt || null,
            };
        });
    }, [identity, stats]);

    useEffect(() => {
        if (cargando) return;
        saveUnlockedAchievements(identity, achievements);
    }, [achievements, cargando, identity]);

    const desbloqueados = achievements.filter((achievement) => achievement.desbloqueado).length;
    const estrellas = calculateAchievementStars(desbloqueados, achievements.length);

    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "240px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 pb-4">
            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/habitos")}>
                    <i className="fa-solid fa-arrow-left me-1"></i>Volver
                </button>
                <h2 className="mb-0">
                    <i className="fa-solid fa-trophy me-2 text-warning"></i>Reconocimientos
                </h2>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: "16px", background: "#fff8e1" }}>
                        <div className="small text-muted">Insignias desbloqueadas</div>
                        <div className="fs-2 fw-bold text-warning">{desbloqueados}/{achievements.length}</div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: "16px", background: "#e6f4ea" }}>
                        <div className="small text-muted">Racha actual</div>
                        <div className="fs-2 fw-bold text-success">{stats.rachaActual} días</div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: "16px", background: "#e8f0fe" }}>
                        <div className="small text-muted">Estrellas de gamificación</div>
                        <div className="fs-5 fw-bold text-primary mb-1">{estrellas}/{MAX_STARS} estrellas</div>
                        <div className="d-flex gap-1" aria-label={`Progreso de estrellas ${estrellas} de ${MAX_STARS}`}>
                            {Array.from({ length: MAX_STARS }).map((_, index) => (
                                <i
                                    key={index}
                                    className={`fa-solid fa-star ${index < estrellas ? "text-warning" : "text-secondary"}`}
                                    style={{ opacity: index < estrellas ? 1 : 0.35 }}></i>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert alert-info border-0 mb-4" role="alert">
                <i className="fa-solid fa-star me-2"></i>
                Progreso general de logros: <strong>{desbloqueados}/{achievements.length}</strong>. Las estrellas aumentan hasta un máximo de <strong>{MAX_STARS}</strong>.
            </div>

            <div className="row g-3">
                {achievements.map((achievement) => (
                    <div key={achievement.id} className="col-12 col-md-6 col-xl-4">
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: "18px",
                                background: achievement.desbloqueado ? "#fff" : "#f8f9fa",
                                opacity: achievement.desbloqueado ? 1 : 0.7,
                            }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div
                                        className={`bg-${achievement.color} text-white d-inline-flex align-items-center justify-content-center`}
                                        style={{ width: "56px", height: "56px", borderRadius: "16px" }}>
                                        <i className={`fa-solid ${achievement.icono} fs-4`}></i>
                                    </div>
                                    <span className={`badge bg-${achievement.desbloqueado ? "success" : "secondary"}`}>
                                        {achievement.desbloqueado ? "Desbloqueada" : "Bloqueada"}
                                    </span>
                                </div>
                                <h5 className="fw-bold mb-2">{achievement.titulo}</h5>
                                <p className="text-muted small mb-3">{achievement.descripcion}</p>
                                {achievement.unlockedAt && (
                                    <div className="small text-success">
                                        <i className="fa-solid fa-circle-check me-1"></i>
                                        Desbloqueada el {new Date(achievement.unlockedAt).toLocaleDateString("es-ES")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};