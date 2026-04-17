import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Registro = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await fetch("https://organic-disco-wr9jv5wp64x535gp6-3001.app.github.dev/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });

        if (response.ok) {
            alert("¡Usuario registrado con éxito!");
            navigate("/login");
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.msg);
        }
    };

    return (
        <div className="container mt-5 w-50">
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            <form onSubmit={handleSubmit} className="border p-4 shadow-sm bg-light rounded">
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">
                    Crear mi cuenta
                </button>
            </form>
        </div>
    );
};