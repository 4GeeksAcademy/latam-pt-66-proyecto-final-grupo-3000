const DAY_IN_MS = 24 * 60 * 60 * 1000;

const formatearFecha = (fecha) => fecha.toISOString().split("T")[0];

const contarRachaActual = (fechasUnicas) => {
    if (fechasUnicas.size === 0) return 0;

    let racha = 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    while (fechasUnicas.has(formatearFecha(hoy))) {
        racha += 1;
        hoy.setTime(hoy.getTime() - DAY_IN_MS);
    }

    return racha;
};

export const ACHIEVEMENTS = [
    {
        id: "primer-paso",
        titulo: "Primer paso",
        descripcion: "Completaste tu primer hábito.",
        icono: "fa-shoe-prints",
        color: "primary",
        requirement: (stats) => stats.totalCompletados >= 1,
    },
    {
        id: "ritmo-semanal",
        titulo: "Ritmo semanal",
        descripcion: "Acumulaste 7 completados en total.",
        icono: "fa-calendar-week",
        color: "success",
        requirement: (stats) => stats.totalCompletados >= 7,
    },
    {
        id: "consistencia-3",
        titulo: "Constancia inicial",
        descripcion: "Mantuviste una racha de 3 días seguidos.",
        icono: "fa-fire",
        color: "warning",
        requirement: (stats) => stats.rachaActual >= 3,
    },
    {
        id: "consistencia-7",
        titulo: "Semana perfecta",
        descripcion: "Lograste 7 días seguidos completando hábitos.",
        icono: "fa-medal",
        color: "info",
        requirement: (stats) => stats.rachaActual >= 7,
    },
    {
        id: "explorador-categorias",
        titulo: "Explorador",
        descripcion: "Completaste hábitos en 3 categorías distintas.",
        icono: "fa-compass",
        color: "secondary",
        requirement: (stats) => stats.categoriasCompletadas >= 3,
    },
    {
        id: "maestria-30",
        titulo: "Maestría 30",
        descripcion: "Alcanzaste una racha de 30 días seguidos.",
        icono: "fa-crown",
        color: "danger",
        requirement: (stats) => stats.rachaActual >= 30,
    },
];

export const MAX_STARS = 5;

export const buildAchievementStats = (habitos = [], registrosPorHabito = {}) => {
    const fechasUnicas = new Set();
    const categoriasCompletadas = new Set();
    let totalCompletados = 0;

    habitos.forEach((habito) => {
        const registros = registrosPorHabito[habito.id] || [];
        registros
            .filter((registro) => registro.completado)
            .forEach((registro) => {
                totalCompletados += 1;
                fechasUnicas.add(registro.fecha);
                if (habito.categoria_nombre) categoriasCompletadas.add(habito.categoria_nombre);
            });
    });

    return {
        totalCompletados,
        diasActivos: fechasUnicas.size,
        rachaActual: contarRachaActual(fechasUnicas),
        categoriasCompletadas: categoriasCompletadas.size,
    };
};

export const evaluateAchievements = (stats) => {
    return ACHIEVEMENTS.map((achievement) => ({
        ...achievement,
        desbloqueado: achievement.requirement(stats),
    }));
};

export const calculateAchievementStars = (desbloqueados, total, maxStars = MAX_STARS) => {
    if (!total || desbloqueados <= 0) return 0;
    return Math.min(maxStars, Math.ceil((desbloqueados * maxStars) / total));
};

const getStorageKey = (identity) => `habit-tracker-achievements:${identity || "anon"}`;

export const getSavedAchievements = (identity) => {
    try {
        const raw = localStorage.getItem(getStorageKey(identity));
        return raw ? JSON.parse(raw) : [];
    } catch (_error) {
        return [];
    }
};

export const saveUnlockedAchievements = (identity, evaluatedAchievements) => {
    const saved = getSavedAchievements(identity);
    const byId = new Map(saved.map((item) => [item.id, item]));
    const newUnlocks = [];

    evaluatedAchievements.forEach((achievement) => {
        if (!achievement.desbloqueado || byId.has(achievement.id)) return;

        const unlocked = {
            id: achievement.id,
            titulo: achievement.titulo,
            unlockedAt: new Date().toISOString(),
        };
        byId.set(achievement.id, unlocked);
        newUnlocks.push(unlocked);
    });

    const merged = Array.from(byId.values());
    localStorage.setItem(getStorageKey(identity), JSON.stringify(merged));

    return { saved: merged, newUnlocks };
};