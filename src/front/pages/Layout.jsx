import { useEffect } from "react"
import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
// --- INICIO APORTE JHON: Importación corregida del hook ---
import useGlobalReducer from "../hooks/useGlobalReducer"
// --- FIN APORTE JHON ---

export const Layout = () => {
    // --- INICIO APORTE JHON: Obtener el estado global ---
    const { store, dispatch } = useGlobalReducer();
    // --- FIN APORTE JHON ---

    useEffect(() => {
        const token = sessionStorage.getItem("token") || localStorage.getItem("token");
        if (!token) return;

        const cargarPlan = async () => {
            try {
                const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/suscripcion", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resp.ok) return;
                const data = await resp.json();
                if (data.plan) {
                    dispatch({ type: "change_plan", payload: data.plan });
                }
            } catch {
                // Evita romper la UI si falla la sincronización del plan.
            }
        };

        cargarPlan();
    }, [dispatch]);

    return (
        <ScrollToTop>
            {/* --- INICIO APORTE JHON: Aplicación de la clase dark-theme --- */}
            <div className={store.darkMode ? "dark-theme d-flex flex-column min-vh-100" : "d-flex flex-column min-vh-100"}>
                <Navbar />
                <main className="flex-grow-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
            {/* --- FIN APORTE JHON --- */}
        </ScrollToTop>
    )
}