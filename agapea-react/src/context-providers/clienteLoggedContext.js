// módulo js para definir el state global con context-api clienteLoggedContext.js
// usando un reducer no el state

import { createContext, useReducer, useContext } from 'react';

// funcion REDUCER para usar en el hook useReducer
// requisitos de un reducer:
// 1º recibe como parametros el state y el action {type: 'LOGIN', payload: {datos cliente: ..., jwt: ...}
// 2º La funcion reducer debe ser pura, es decir, no puede modificar el state directamente

const clienteLoggedReducer = (state, action) => {
  // en action.payload viene el objeto cliente {datos cliente: ..., jwt: ...} o {}
    switch (action.type) {
        case 'CLIENTE_LOGGED':
            return action.payload;
        case 'CLIENTE_LOGOUT':
            return null;
        default:
            return state; // clienteLogged
    }
}

const ClienteLoggedContext = createContext(null);

// a EXPORTAR:  componente con codigo jsx que defina el provider del contexto y pase valores del recuder a los componentes hijos
export function ClienteLoggedProvider({ children }) {
    const [clienteLogged, dispatchClienteLogged] = useReducer(clienteLoggedReducer, null);

    return (
        <ClienteLoggedContext.Provider value={{ clienteLogged, dispatchClienteLogged }}>
            {children}
        </ClienteLoggedContext.Provider>
    );
}

// a EXPORTAR: hook personalizado para usar el contexto
export function useClienteLoggedContext() {
    return useContext(ClienteLoggedContext);
}