const mongoose = require('mongoose');

var clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, '* Nombre obligatario'], maxLength: [50, '* Maxima long.en nobre de 50 caract.'] },
    apellidos: { type: String, required: [true, '* Apellidos obligatarios'], maxLength: [200, '* Maxima long.en apellidos de 200 caract.'] },
    cuenta: {
      email: { type: String, required: [true, '* Email obligatorio'], match: [new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,3})+$'), '* formato incorrecto del email'] },
      password: { type: String, required: [true, '* Password oblitaoria'], match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])\S{8,}$/, '* En la password al menos una MAYS, MINS, NUMERO y caracter raro'] },
      cuentaActiva: { type: Boolean, required: true, default: false },
      login: { type: String, maxLength: [200, '* max.longitud del email 200 cars.'] },
      imagenAvatarBASE64: { type: String, default: '' }
    },
    telefono: { type: String, required: [true, '* Telefono obligatorio'], match: [/^\d{3}(\s?\d{2}){3}$/, '*El telefono tiene q tener formato 666 11 22 33'] },
    direcciones: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion' }
    ],
    pedidos: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }
    ]

  }
)

module.exports = mongoose.model('Cliente', clienteSchema, 'clientes');