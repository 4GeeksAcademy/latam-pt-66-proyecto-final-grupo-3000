import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

export const Exportar = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    const [habitos, setHabitos] = useState([]);
    const [registros, setRegistros] = useState({});
    const [cargando, setCargando] = useState(true);
    const [exportandoCsv, setExportandoCsv] = useState(false);
    const [exportandoPdf, setExportandoPdf] = useState(false);

    const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/habitos", { headers });
            if (!resp.ok) {
                setCargando(false);
                return;
            }

            const dataHabitos = await resp.json();
            setHabitos(dataHabitos);

            const detalles = await Promise.all(
                dataHabitos.map(async (h) => {
                    const registrosResp = await fetch(
                        import.meta.env.VITE_BACKEND_URL + `/api/habitos/${h.id}/registros`,
                        { headers }
                    );
                    if (!registrosResp.ok) return [h.id, []];
                    const dataRegistros = await registrosResp.json();
                    return [h.id, dataRegistros];
                })
            );

            setRegistros(Object.fromEntries(detalles));
        } catch (_error) {
            setHabitos([]);
            setRegistros({});
        } finally {
            setCargando(false);
        }
    };

    const filasExportacion = useMemo(() => {
        return habitos
            .flatMap((habito) => {
                const registrosHabito = registros[habito.id] || [];
                return registrosHabito
                    .filter((registro) => registro.completado)
                    .map((registro) => ({
                        fecha: registro.fecha,
                        habito: habito.nombre,
                        categoria: habito.categoria_nombre || "Sin categoría",
                        descripcion: habito.descripcion || "",
                        estado: "Completado"
                    }));
            })
            .sort((a, b) => b.fecha.localeCompare(a.fecha));
    }, [habitos, registros]);

    const categoriasRegistradas = useMemo(() => {
        const categorias = habitos
            .map((h) => h.categoria_nombre)
            .filter((categoria) => !!categoria);
        return [...new Set(categorias)];
    }, [habitos]);

    const escaparCsv = (valor) => {
        const texto = String(valor ?? "");
        if (/[",\n]/.test(texto)) {
            return `"${texto.replace(/"/g, '""')}"`;
        }
        return texto;
    };

    const descargarCsv = () => {
        if (filasExportacion.length === 0) return;
        setExportandoCsv(true);

        const columnas = ["Fecha", "Hábito", "Categoría", "Descripción", "Estado"];
        const contenido = [
            columnas.join(","),
            ...filasExportacion.map((fila) =>
                [
                    escaparCsv(fila.fecha),
                    escaparCsv(fila.habito),
                    escaparCsv(fila.categoria),
                    escaparCsv(fila.descripcion),
                    escaparCsv(fila.estado)
                ].join(",")
            )
        ].join("\n");

        const blob = new Blob([`\uFEFF${contenido}`], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `historial_habitos_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExportandoCsv(false);
    };

    const descargarPdf = () => {
        if (filasExportacion.length === 0) return;
        setExportandoPdf(true);

        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const nombreUsuario = sessionStorage.getItem("nombre") || "Usuario";

        doc.setFontSize(16);
        doc.text("Reporte de historial de hábitos", 14, 18);
        doc.setFontSize(11);
        doc.text(`Generado para: ${nombreUsuario}`, 14, 25);
        doc.text(`Registros completados: ${filasExportacion.length}`, 14, 31);
        doc.text(`Categorías registradas: ${categoriasRegistradas.length}`, 14, 37);

        let y = 46;
        doc.setFontSize(9);

        filasExportacion.forEach((fila, index) => {
            const linea = `${index + 1}. [${fila.fecha}] ${fila.habito} | ${fila.categoria} | ${fila.estado}`;
            const lineasEnvueltas = doc.splitTextToSize(linea, 180);

            if (y + lineasEnvueltas.length * 5 > 285) {
                doc.addPage();
                y = 20;
            }

            doc.text(lineasEnvueltas, 14, y);
            y += lineasEnvueltas.length * 5;
        });

        doc.save(`historial_habitos_${new Date().toISOString().split("T")[0]}.pdf`);
        setExportandoPdf(false);
    };

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
            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/historial")}>
                    <i className="fa-solid fa-arrow-left me-1"></i>Volver
                </button>
                <h2 className="mb-0">
                    <i className="fa-solid fa-file-export me-2 text-primary"></i>Exportación de datos
                </h2>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                <div className="card-body p-4">
                    <p className="text-muted mb-4">
                        Descarga tu historial de hábitos completados para compartir tu progreso con un profesional o guardarlo fuera de la app.
                    </p>

                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ background: "#e6f4ea" }}>
                                <div className="small text-muted">Hábitos activos</div>
                                <div className="fs-3 fw-bold text-success">{habitos.length}</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ background: "#e8f0fe" }}>
                                <div className="small text-muted">Registros exportables</div>
                                <div className="fs-3 fw-bold text-primary">{filasExportacion.length}</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ background: "#fff8e1" }}>
                                <div className="small text-muted">Categorías registradas</div>
                                <div className="fs-3 fw-bold text-warning">{categoriasRegistradas.length}</div>
                            </div>
                        </div>
                    </div>

                    {categoriasRegistradas.length > 0 && (
                        <div className="mb-4">
                            <div className="small text-muted mb-2">Categorías incluidas en la exportación</div>
                            <div className="d-flex flex-wrap gap-2">
                                {categoriasRegistradas.map((categoria) => (
                                    <span key={categoria} className="badge bg-secondary px-3 py-2" style={{ borderRadius: "12px" }}>
                                        {categoria}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {filasExportacion.length === 0 ? (
                        <div className="alert alert-info mb-0" role="alert">
                            Aún no tienes registros completados para exportar.
                        </div>
                    ) : (
                        <div className="d-flex flex-wrap gap-2">
                            <button className="btn btn-success" onClick={descargarCsv} disabled={exportandoCsv}>
                                <i className="fa-solid fa-file-csv me-1"></i>
                                {exportandoCsv ? "Generando CSV..." : "Descargar CSV"}
                            </button>
                            <button className="btn btn-danger" onClick={descargarPdf} disabled={exportandoPdf}>
                                <i className="fa-solid fa-file-pdf me-1"></i>
                                {exportandoPdf ? "Generando PDF..." : "Descargar PDF"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};