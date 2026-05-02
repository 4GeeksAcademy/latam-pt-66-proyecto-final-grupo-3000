// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login.jsx";
import { Registro } from "./pages/Registro.jsx";
import { Habitos } from "./pages/Habitos.jsx";
import { Perfil } from "./pages/Perfil.jsx";
import { Historial } from "./pages/Historial.jsx";
import { Exportar } from "./pages/exportar.jsx";
import { Reconocimientos } from "./pages/Reconocimientos.jsx";

// --- APORTE JHON: Importaciones verificadas ---
import { Checkout } from "./pages/Checkout.jsx"; 
import { Suscripciones } from "./pages/Suscripciones.jsx";
// --- FIN APORTE JHON ---

import { Acercade } from "./components/Acercade.jsx";
import { Ayuda } from "./components/Ayuda.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      
      {/* --- APORTE JHON: Rutas de pagos y suscripciones --- */}
      <Route path="/suscripciones" element={<Suscripciones />} />
      <Route path="/checkout" element={<Checkout />} />
      {/* --- FIN APORTE JHON --- */}

      <Route path="/habitos" element={<Habitos />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/historial" element={<Historial />} />
      <Route path="/exportar" element={<Exportar />} />
      <Route path="/reconocimientos" element={<Reconocimientos />} />
      <Route path="/acercade" element={<Acercade />} />
      <Route path="/ayuda" element={<Ayuda />} />
    </Route>
  )
);