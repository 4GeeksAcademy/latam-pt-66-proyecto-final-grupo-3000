import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
// --- INICIO APORTE JHON: Importación corregida del hook ---
import useGlobalReducer from "../hooks/useGlobalReducer"
// --- FIN APORTE JHON ---

export const Layout = () => {
    // --- INICIO APORTE JHON: Obtener el estado global ---
    const { store } = useGlobalReducer();
    // --- FIN APORTE JHON ---

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