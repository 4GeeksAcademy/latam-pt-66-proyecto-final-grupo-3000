import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AuthShell } from "../components/AuthShell.jsx";
const backendUrl = import.meta.env.VITE_BACKEND_URL + "/api/login";

export const Login = () => {
    const { dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const showError = () => {
        setError(true);
        setTimeout(() => setError(false), 3000);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(false);

        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("nombre", data.nombre || "");
            dispatch({ type: "change_plan", payload: data.plan || "free" });

            // Si "Recuérdame" está marcado, guardar token en localStorage
            if (rememberMe) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("nombre", data.nombre || "");
                localStorage.setItem("email", email);
            } else {
                // Si no está marcado, limpiar localStorage
                localStorage.removeItem("token");
                localStorage.removeItem("nombre");
                localStorage.removeItem("email");
            }
            navigate("/habitos");
        } else {
            showError();
        }
    };

    //Función que actualiza el estado del checkbox "Recuérdame"
    // El token se guardará en localStorage después de un login exitoso si esta opción está marcada
    const handleRememberMe = (e) => {
        setRememberMe(e.target.checked);
    };

    return (
        <AuthShell
            pageClassName="main_Login auth-page auth-page--login"
            panelIcon="fa-solid fa-leaf"
            panelTitle="¡Bienvenido!"
            panelText="Continúa con tus hábitos saludables y alcanza tus metas hoy."
            formTitle="¡Hola!"
            formSubtitle="Inicia sesión en tu cuenta"
            panelClassName="auth-panel--login"
            reverse={false}
        >
            {error && (
                <div className="alert alert-danger border-0 small py-2">
                    Usuario o contraseña incorrectos.
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div className="mb-4 position-relative">
                    <i className="fa-regular fa-envelope position-absolute top-50 start-0 translate-middle-y text-muted"></i>
                    <input
                        className="form-control input-underlined"
                        type="email"
                        placeholder="Correo electrónico"
                        required
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4 position-relative">
                    <i className="fa-solid fa-lock position-absolute top-50 start-0 translate-middle-y text-muted"></i>
                    <input
                        className="form-control input-underlined"
                        type={mostrarPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        required
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted p-0"
                        style={{ textDecoration: "none" }}
                        onClick={() => setMostrarPassword(prev => !prev)}
                        aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                        <i className={`fa-solid ${mostrarPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                </div>

                <div className="d-flex justify-content-between mb-4 small">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember" checked={rememberMe} onChange={handleRememberMe} />
                        <label className="form-check-label text-muted" htmlFor="remember">Recuérdame</label>
                    </div>
                </div>

                <button className="btn btn-primary login-btn w-100 text-white" type="submit">
                    Iniciar sesión
                </button>
            </form>

            <div className="text-center mt-5">
                <p className="small text-muted mb-0">
                    ¿No tienes cuenta?
                    <span className="text-primary fw-bold ms-1 auth-link" onClick={() => navigate("/registro")}>
                        Registrarse
                    </span>
                </p>
            </div>
        </AuthShell>
    );
};