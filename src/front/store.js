// CORRECCIÓN: Ahora es una función que retorna el objeto inicial
export const initialStore = () => {
    return {
        // --- TUS PLANES ---
        plan: 'free',
        darkMode: false,
        
        // --- TRABAJO DE COMPAÑEROS (MANTENIDO) ---
        message: null,
        habitos: [
            { id: 1, nombre: "Beber agua", completado: false },
            { id: 2, nombre: "Hacer ejercicio", completado: false }
        ]
    };
};

export default function globalReducer(store, action) {
    switch (action.type) {
        case 'set_message':
            return {
                ...store,
                message: action.payload
            };
        case 'change_plan':
            return {
                ...store,
                plan: action.payload
            };
        case 'toggle_dark_mode':
            return {
                ...store,
                darkMode: !store.darkMode
            };
        default:
            return store;
    }
}