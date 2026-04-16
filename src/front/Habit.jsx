import React, { useState, useEffect } from "react";

export const HabitsPage = () => {
    const [habits, setHabits] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const backendUrl = "https://improved-fiesta-r4q457wqx4972pgq7-3001.app.github.dev/api/habits";

    const getHabits = async () => {
        try {
            const resp = await fetch(backendUrl);
            const data = await resp.json();
            if (resp.ok) setHabits(data);
        } catch (error) {
            console.error("Error cargando hábitos", error);
        }
    };

    const createHabit = async (e) => {
        e.preventDefault();
        const resp = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        if (resp.ok) {
            setFormData({ name: "", description: "" });
            getHabits();
        }
    };

    useEffect(() => { getHabits(); }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Mis Hábitos</h1>
            <form onSubmit={createHabit} className="card p-4 shadow-sm mb-5">
                <input
                    type="text" placeholder="Nombre" className="form-control mb-2"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                />
                <textarea
                    placeholder="Descripción" className="form-control mb-2"
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <button type="submit" className="btn btn-success w-100">Registrar Hábito</button>
            </form>

            <div className="list-group">
                {habits.map((h, i) => (
                    <div key={i} className="list-group-item">
                        <h5>{h.name}</h5>
                        <p className="mb-0 text-muted">{h.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

