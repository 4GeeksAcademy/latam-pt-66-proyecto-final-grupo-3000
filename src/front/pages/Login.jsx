import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(false);

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("email", email);
            navigate("/habitos");
        } else {
            setError(true);
        }
    };

    return (
        <>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "15vh" }}> 
     
        <h1 className="text-info">Inicio de sesión - App de Habitos </h1>
        
        </div>
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "500px", borderRadius: "15px" }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-info">Login</h2>
                    <p className="text-muted">Inicia sesión si ya tienes una cuenta</p>
                </div>
                {error && (
                    <div className="alert alert-danger py-2 text-center animate__animated animate__shakeX" role="alert">
                        <i className="fa-solid fa-triangle-exclamation me-2"></i>Autenticación incorrecta, por favor verifica tus credenciales.
                    </div>
                    
                )}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Ingresa tu Correo</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><i className="fa-regular fa-envelope"></i></span>
                            <input
                                className="form-control"
                                type="email"
                                placeholder="test@email.com"
                                required
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Ingresa tu Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><i className="fa-solid fa-lock"></i></span>
                            <input
                                className="form-control"
                                type="password"
                                placeholder="********"
                                required
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-info w-100 py-2 fw-bold text-bg-light" type="submit" style={{ borderRadius: "8px" }}> <i className="fa-solid fa-right-to-bracket me-2"></i> Inicio de Sesión
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="small mb-0">¿No tienes cuenta?
                        <span
                            className="text-primary fw-bold ms-1"
                            style={{ cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => navigate("/registro")}
                        >
                            Registrarse
                        </span>
                    </p>
                </div>
            </div>
        </div>
           </>
    );
};
