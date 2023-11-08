import { Outlet, useLoaderData, Link, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import tiendaRESTService from '../../../servicios/restTienda';

function Layout() {
    //<---- el hook useLoaderData recupear del loader asociado los datos....

    let _listacategorias = useLoaderData();
    const location = useLocation()

    const isMostrarPedido = location.pathname === "/Pedido/MostrarPedido"

    function renderizarCategorias(idCategoria){
        console.log(idCategoria)
        async function fetchData() {
            console.log(_listacategorias)
            let _categorias = await tiendaRESTService.recuperarCategorias("/Tienda/Libros/" + idCategoria);
            _listacategorias = _categorias
        }
        fetchData();
    }
    return (
        <>
            <Header />

            <div className="container">
                <div className="row">
                    {/* ----- columna para categorias ------ */}
                    <div className="col-3">
                        {
                            !isMostrarPedido ? <h6>Categorias</h6> : null
                        }
                        <div className="list-group">
                            {
                                !isMostrarPedido && _listacategorias.map(
                                    (cat) => <Link key={cat.IdCategoria} to={"/Tienda/Libros/" + cat.IdCategoria}
                                        className="list-group-item list-group-item-action" onClick={() => renderizarCategorias(cat.IdCategoria)}>
                                        {cat.NombreCategoria}
                                    </Link>
                                )
                            }
                        </div>

                    </div>

                    {/* ------ columna para mostrar en funcion del path, el componente segun REACT-ROUTER ---- */}
                    <div className="col-9">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Layout;