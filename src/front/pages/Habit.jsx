import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const Habit = () => {
    const navigate = useNavigate();
    const [habits, setHabits] = useState([]);

    const getHabits = async (token) => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/habits", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (resp.ok) {
                const data = await resp.json();
                setHabits(data);
            } else if (resp.status === 401) {

                sessionStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error cargando hábitos:", error);
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
        } else {
            getHabits(token);
        }
    }, []);

    return (
        <div className="container mt-5 main_Habits">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-6">Mis Hábitos</h2>
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                        sessionStorage.removeItem("token");
                        navigate("/login");
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>

            {habits.length === 0 ? (
                <div className="alert alert-info text-center">
                    No tienes hábitos . ¡Comienza uno hoy!
                </div>
            ) : (
                <ul className="list-group shadow-sm">
                    {habits.map((h) => (
                        <li key={h.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{h.name}</strong>
                                <p className="mb-0 text-muted small">{h.description}</p>
                            </div>
                            <span className="badge bg-primary rounded-pill">Activo</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};