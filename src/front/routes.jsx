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

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path="/" element={<Home />} />
        <Route path="/single/:theId" element={<Single />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/habitos" element={<Habitos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/exportar" element={<Exportar />} />
      </Route>
    )
);
