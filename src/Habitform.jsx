import React, { useState } from "react";

export const HabitForm = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const guardarHabito = async () => {
        
        const response = await fetch(process.env.BACKEND_URL + "/api/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nombre, description: descripcion })
        });

        if (response.ok) {
            alert("¡Hábito guardado!");
            setNombre("");
            setDescripcion("");
        }
    };

    return (
        <div className="p-3 border rounded shadow-sm">
            <input
                className="form-control mb-2"
                placeholder="Nombre del hábito"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <textarea
                className="form-control mb-2"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <button onClick={guardarHabito} className="btn btn-success w-100">
                Añadir Hábito
            </button>
        </div>
    );
};