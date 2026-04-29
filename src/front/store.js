export const initialStore=()=>{
  return{
    message: null,
    token: null,
    darkMode: false, // <-- 1. Agregamos la variable aquí
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'toggle_dark_mode': // <-- 2. Agregamos este "caso" nuevo
      return {
        ...store,
        darkMode: !store.darkMode // Esto cambia de true a false y viceversa
      };
      
    case 'add_task':
      const { id,  color } = action.payload
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    default:
      return store; // Cambié el Error por retornar el store para que no se trabe tu App
  }    
}