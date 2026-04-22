import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Registro = () => {
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Usamos la variable específica para Vite que tienes en tu .env
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Registro exitoso en la base de datos!");
                navigate("/login");
            } else {
                alert("Error: " + (data.msg || "No se pudo registrar"));
            }
        } catch (error) {
            console.error("Error conectando al servidor:", error);
            alert("No se pudo conectar al servidor. Revisa que el puerto 3001 sea Público.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Crear Cuenta</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label font-weight-bold">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label font-weight-bold">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2">
                        Registrar en Base de Datos
                    </button>
                </form>
            </div>
        </div>
    );
};
