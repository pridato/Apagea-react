import { useState } from "react";
import { Link, useNavigate, useLocation, useLoaderData } from 'react-router-dom'

function MostrarPedido() {

  const pedidos_string = localStorage.getItem('pedidos')
  let pedidos = useLoaderData()
  if (pedidos.length === 0) pedidos = pedidos_string ? JSON.parse(pedidos_string) : []

  // obtener datos cliente
  

  return (
    <div className="row">
      {/* columna para envios facturacion y pago*/}
      <div className="col-8">
        <div className="container">
          <div className="row">

            {/* columna para envios*/}

            <div className="container">

              <div className="row mt-4">
                <div className="col-1">
                  <img src="/images/img1_mostrar_pedido_datosentrega.png" style={{ width: "40px", height: "26px" }} alt="" />
                </div>

                <div className="col-11">
                  <h4><strong>1. Datos de entrega </strong></h4>
                </div>

              </div>

              {/* opcion Recogida */}
              <div className="row">
                <div className="form-check">
                  <input type="radio" className="form-check-input" name="direccionradios" value="direccionprincipal" checked />
                  <label className="form-check-label" for="direccionprincipal">

                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}