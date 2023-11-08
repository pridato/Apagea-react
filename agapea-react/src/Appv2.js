import { useState, useEffect, useReducer } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";

import tiendaRESTService from "./servicios/restTienda";

import Login from './componentes/zonaCliente/loginComponent/Login';
import Registro from './componentes/zonaCliente/registroComponent/Registro';
import Layout from "./componentes/zonaTienda/layoutComponentes/Layout";
import Libros from "./componentes/zonaTienda/librosComponentes/Libro";
import MostrarLibro from "./componentes/zonaTienda/librosComponentes/MostrarLibro";
import Pedido from "./componentes/zonaTienda/pedidosComponentes/Pedido";
import { ClienteLoggedProvider } from './context-providers/clienteLoggedContext';
import { ItemsCarritoProvider } from './context-providers/itemsCarroContext';

//bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';



//--------------array de objetos Route creados con metodo createBrowserRouter a pasar al proveedor de rutas RouterProvider----
const routerObjects=createBrowserRouter(
    [
      {
        element: <Layout />,
        loader: tiendaRESTService.recuperarCategorias , //<---- funcion asincrona q se ejecuta de forma paralela a la carga del componente <Layout/> lo vamos a usar para cargar categorias...
        children:[
                    { path: '/',  element:<Navigate to="Tienda/Libros" />},
                    { path: '/Tienda/Libros/:idcategoria?', element: <Libros />, loader: tiendaRESTService.recuperarLibros },                    
                    { path: '/Tienda/MostrarLibro/:isbn13', element: <MostrarLibro />}, //<---- se podria usar un loader para cargar el libro, pero uso hook: useEffect
                    { path: '/Pedido/MostrarPedido', element: <Pedido />, loader: tiendaRESTService.recuperarCarrito }

        ]
      }, //si quieres usar un layout creas un objeto json si path...y con propiedad children <--- pones rutas hijas q quieres cargar dentro del layout
      { path: '/Cliente/Login', element: <Login/>},
      { path: '/Cliente/Registro', element:<Registro />},
      {path: 'Tienda/Pedido', element: <Pedido />}
    ]
);

function Appv2({ props }) {
  return (
    <ClienteLoggedProvider>
      <ItemsCarritoProvider>
        <RouterProvider router={routerObjects} />
      </ItemsCarritoProvider>
    </ClienteLoggedProvider>
  );
}
export default Appv2;