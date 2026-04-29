import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL + "/api/login";

export const Login = () => {
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
        <>
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-2 main_Login">
                <div className="card shadow-lg border-0 overflow-hidden" style={{ maxWidth: "900px", borderRadius: "24px" }}>
                    <div className="row g-0">


                        <div className="col-12 col-md-5 bg-gradient-blue d-flex flex-column justify-content-center align-items-center p-5 text-white text-center order-first">
                            <div className="bg-white p-3 rounded-circle mb-3 shadow">
                                <i className="fa-solid fa-leaf text-info fs-1"></i>
                            </div>
                            <h2 className="fw-bold">¡Bienvenido!</h2>
                            <p className="small opacity-75">Continúa con tus hábitos saludables y alcanza tus metas hoy.</p>
                        </div>


                        <div className="col-12 col-md-7 bg-white p-4 p-lg-5">
                            <div className="mb-4">
                                <h1 className="fw-bold title_form">¡Hola!</h1>
                                <p className="text-muted">Inicia sesión en tu cuenta</p>
                            </div>

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
                                <p className="small text-muted">
                                    ¿No tienes cuenta?
                                    <span className="text-primary fw-bold ms-1" style={{ cursor: "pointer" }} onClick={() => navigate("/registro")}>
                                        Registrarse
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};