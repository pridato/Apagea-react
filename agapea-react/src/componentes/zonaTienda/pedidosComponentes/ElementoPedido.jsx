  import { useItemsCarritoContext } from "../../../context-providers/itemsCarroContext";


  function ElementoPedido ( { item }){
    let { itemsCarro, setItemsCarrito } = useItemsCarritoContext();
    let { libroElemento, cantidadElemento } = item;

    function BotonClickHandler(ev){
      // manejadora de eventos click de los botones de eliminar , sumar y restar 

      let { name, isbn13 } = ev.target.split('-');
      console.log('BotonClickHandler', name, isbn13)

      // Tendría que modificar el array de itemsCarrito sin mutarlo

      switch (name) {
        case 'botonEliminar': // para no mutar el array de itemsCarrito, lo modifico con el mismo contenido pero sin el elemento que quiero eliminar
            setItemsCarrito(itemsCarro.filter( el => el.libroElemento.ISBN13 !== isbn13));
          break;

        case 'botonSumar': // para no mutar clonarlo y modificar la posicion del array donde este el isbn del libro a sumar
        /*
            let _newItems = itemsCarro.slice()
            let _pos = _newItems.findIndex( item => item.libroElemento.ISBN13 === isbn13);
            _newItems[_pos].cantidadElemento++;
            setItemsCarrito(_newItems);

            // con map seria asi:
            // setItemsCarrito(itemsCarro.map( item => {
            //   if(item.libroElemento.ISBN13 === isbn13){
            //     item.cantidadElemento++;
            //   }
        */
            setItemsCarrito(
              itemsCarro.map( item => item.libroElemento.ISBN13 === isbn13 ? {...item, cantidadElemento: item.cantidadElemento + 1} : item)
            )


          break;

        case 'botonRestar':
          setItemsCarrito(
            itemsCarro.map(item => {
              if (item.libroElemento.ISBN13 === isbn13) {
                const _nuevacantidad = item.cantidadElemento - 1;
                return _nuevacantidad > 0 ? { ...item, cantidadElemento: _nuevacantidad } : null;
              }
              else
              return item;
            }
          ));
          break;

        default:

          break;
      }

    }

    return (
  <div className="card mb-3" style={{ maxwidth: "540px" }}>
                      <div className="row g-0">
                        <div className="col-md-4">
                          <img
                            src={libroElemento.ImagenLibroBASE64} className="img-fluid rounded-start" alt="..."
                          />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body">
                            <div className="d-flex flex-row justify-content-between">
                              <h5 className="card-title">{libroElemento.Titulo}</h5>

                              {/*boton para eliminar libro de elementos pedido*/}
                              <button
                                className="btn btn-light btn-sm"
                                name={'botonEliminar-' + libroElemento.ISBN13}
                                onClick={BotonClickHandler}
                              >
                                X
                              </button>
                            </div>
                            <div className="d-flex flex-row justify-content-between">
                              {/*boton +, label cantidad, boton -  el precio del libro y subtotal elemento pedido*/}
                              <button
                                className="btn btn-outline-primary btn-sm"
                                name={'botonSumar'+libroElemento.ISBN13}
                                onClick={BotonClickHandler}
                              >
                                -
                              </button>

                              <label> <small>{cantidadElemento}</small></label>

                              <button className="btn btn-outline-primary btn-sm" name={'botonRestar'+libroElemento.ISBN13} onClick={BotonClickHandler}>
                                +
                              </button>

                              <label>
                                <small>x</small>
                                <span style={{ color: "red" }}>
                                  {libroElemento.Precio}€
                                </span>
                              </label>
                              <label style={{ color: "red" }}>
                                {libroElemento.Precio * cantidadElemento}€
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>  
    )
  }

  export default ElementoPedido;