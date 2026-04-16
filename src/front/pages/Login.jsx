import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const showError = () => {
        setError(true);
        setTimeout(() => setError(false), 3000);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(false);

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        // Igual lo emplemente despues de ver que el aviso de error se mostraba pero no se ocultaba, entonces lo que hice fue agregar un setError(false) al inicio de la función handleLogin para asegurarme de que el error se oculte cada vez que se intente iniciar sesión, incluso antes de hacer la solicitud al backend. De esta manera, si el usuario corrige su correo o contraseña y vuelve a intentar iniciar sesión, el mensaje de error se ocultará automáticamente.
        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("email", email);
            navigate("/habitos");
        } else {
            showError();
        }
    };

    //funcion si activa el check de "Recuérdame", se podría guardar el token en localStorage en lugar de sessionStorage para mantener la sesión incluso después de cerrar el navegador.
    //Lo estoy implementado opcionalmente para que el usuario pueda elegir si quiere mantener la sesión o no. por eso realice el commit despues. 
    const handleRememberMe = (e) => {
        if (e.target.checked) {
            // Guardar el token en localStorage para mantener la sesión
            const token = sessionStorage.getItem("token");
            if (token) {
                localStorage.setItem("token", token);
            }
        } else {
            // Eliminar el token de localStorage si se desmarca
            localStorage.removeItem("token");
        }
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
                                <h1 className="fw-bold title_form">App Habit Tracker</h1>
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
                                        type="password"
                                        placeholder="Contraseña"
                                        required
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="d-flex justify-content-between mb-4 small">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="remember" onChange={handleRememberMe} />
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

