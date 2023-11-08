// módulo js para definir el state global con context-api itemsCarritoContext.js
// usando un reducer no el state

import { createContext, useReducer, useContext } from 'react';

const itemsCarritoReducer = (state, action) => {
  // en action.payload viene el objeto cliente {libroElemento } o {}
    switch (action.type) {
        case 'ADD_NUEVO_LIBRO_CARRO':

            return [...state, action.payload];

        case 'SUMAR_CANTIDAD_LIBRO_CARRO':

            return state.map((item) => {
                if (item.libroElemento.isbn13 === action.payload.isbn13) {
                    return { ...item, cantidad: item.cantidad + 1 };
                }
                return item;
            });

        case 'RESTAR_CANTIDAD_LIBRO_CARRO':

            return state.map((item) => {
                if (item.libroElemento.isbn13 === action.payload.isbn13) {
                    return { ...item, cantidad: item.cantidad - 1 };
                }
                return item;
            });
            
        case 'ELIMINAR_LIBRO_CARRO':
            return [];
        default:
            return state;
    }
}

const ItemsCarritoContext = createContext([]);

// a EXPORTAR:  componente con codigo jsx que defina el provider del contexto y pase valores del recuder a los componentes hijos

export function ItemsCarritoProvider({ children }) {
    const [itemscarro, dispatchItemsCarro] = useReducer(itemsCarritoReducer, []);

    return (
        <ItemsCarritoContext.Provider value={{ itemscarro, dispatchItemsCarro }}>
            {children}
        </ItemsCarritoContext.Provider>
    );
}

// a EXPORTAR: hook personalizado para usar el contexto
export function useItemsCarritoContext() {
    return useContext(ItemsCarritoContext);
}