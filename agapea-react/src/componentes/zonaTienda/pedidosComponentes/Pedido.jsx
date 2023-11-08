import { useState, useEffect} from 'react'
import {useItemsCarritoContext} from '../../../context-providers/itemsCarroContext'
import {Link} from 'react-router-dom'
import ElementoPedido from './ElementoPedido'

function Pedido(){

  let { itemsCarro } = useItemsCarritoContext();

  // -------- state para los elementos del pedido --------
  // este state debe recalcularse cada vez que se modifique el state itemsCarro
  const [subtotalPedido, setSubtotalPedido] = useState(0);
  const [gastosEnvio, setGastosEnvio] = useState(2);
  //const [totalPedido, setTotalPedido] = useState(0);

  useEffect(
    () => {
      let _subtotalPedido = itemsCarro.reduce( (acum, el) => acum + (el.libroElemento.Precio * el.cantidadElemento), 0);
      setSubtotalPedido(_subtotalPedido);

    }
    , [itemsCarro]
  )

  function HandlerSubmitCompra(ev){
    // ...envío a nodejs los datos del pedido y los datos de envío y facturación

    // vista del componente 
  }


  return(
    <div className="container">
      <div className="row">
      {/* -------------- columna para direccion de envio, facturacion y metodo de pago ------*/}
      <div className="col-8">
      
      </div>


      {/* -------------- columna para resumen del pedido ------*/}
      <div className="col-4">
        <div className="container">
          <div className="row"><h6><strong>Resumen de la cesta</strong></h6></div>
          <hr></hr>
          {
            itemsCarro.length === 0 ?
            (
              <p>... no hay ningun libro añadido al carrito de momento, sigue comprando...</p>
            )
            :
            (
              <>
                {
                  itemsCarro.map(
                    elemento => {
                      <ElementoPedido item={elemento} key={elemento.libroElemento.ISBN13} />
                    }
                  )
                }
                <div className="row">+
                  <div className="col-10"><p><strong>SubTotal:</strong></p></div>
                  <div className="col-2"><span style={{color:'red'}}>{subtotalPedido}€</span></div>
                </div>
                <div className="row">
                  <div className="col-10"><p><strong>Gastos de envio y gestion:</strong></p></div>
                  <div className="col-2"><span style={{color:'red'}}>{gastosEnvio}€</span></div>
                </div>
                <div className="row">
                  <div className="col-10"><p><strong>Gastos de envio y gestion:</strong></p></div>
                  <div className="col-2"><span style={{color:'red'}}>{subtotalPedido + gastosEnvio}€</span></div>
                </div>
                <div className="row"><small>El periodo de entrega es de <span style={{color: 'green'}}>1 a 7 días laborables</span></small></div>
              </>
            )    
          }

          <div className="row">
            <div className="col-6">
              <Link to="Tienda/Libros/2-10" className='btn btn-outline-primary'>
                <i className='fa-solid fa-book'></i>Seguir comprando
              </Link>
            </div>
            <div className="col-6">
              <button onClick={HandlerSubmitCompra} className='btn btn-primary'>
                <i className='fa-solid fa-truck-fast'></i> Finalizar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Pedido;