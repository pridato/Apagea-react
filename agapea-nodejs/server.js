require('dotenv').config()

const express = require('express') // la variable express se almacena la funcion q genera el servidor web
const serverExpress = express()

const mongoose = require('mongoose')

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const bcrypt = require('bcrypt')
const Mailjet = require('node-mailjet')
const jsonwebtoken = require('jsonwebtoken')

const Cliente = require('./modelos/cliente')
const Categoria = require('./modelos/categoria')
var Direccion = require('./modelos/direccion')
var Pedido = require('./modelos/pedido');
const Libro = require('./modelos/libro')

// - cookie-parser: extrae de la pet.del cliente http-request, la cabecera Cookie, extrae su valor y lo mete en una prop.del objeto req.cookie
// - body-parser: extrae de la pet.del cliente http-rerquest, del body los datos mandados en formato x-www-form-urlenconded o json extrae su valor y los mete en una prop.del objeto req.body
// - cors: para evitar errores cross-origin-resouce-sharing
serverExpress.use(cookieParser())
serverExpress.use(bodyParser.json())
serverExpress.use(bodyParser.urlencoded({ extended: true }))
serverExpress.use(cors())

// #region --------------------- endpoints de la API REST PARTE CLIENTE---------------------

serverExpress.post('/api/Cliente/Registro', async (req, res, next) => {
  try {
    // 1º paso:insertamos datos a mongoDB
    const _resultInsertCliente = await new Cliente(
      {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        cuenta: {
          email: req.body.email,
          login: req.body.login,
          password: bcrypt.hashSync(req.body.password, 10),
          cuentaActiva: false,
          imagenAvatarBASE64: ''
        }
      }
    ).save() // <--- devuelve una promesa q se resuelve con el objeto insertado en mongoDB

    console.log('resultado del insert en la coleccion clientes de mongodb...', _resultInsertCliente)

    // 2º paso: enviamos email de confirmacion de registro al cliente
    const mailjet = new Mailjet({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE
    })
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'davidarroyo25052004@gmail.com',
              Name: 'Mailjet Pilot'
            },
            To: [
              {
                Email: req.body.email,
                Name: `${_resultInsertCliente.nombre} ${_resultInsertCliente.apellidos}`
              }
            ],
            Subject: 'Bienvenido a Apagea!',
            TextPart: '¡Bienvenido a Apagea! Haga clic en el enlace a continuación para activar su cuenta.',
            HTMLPart: `
        <h3>Bienvenido a Apagea</h3>
        <p>la bebesita bebelean</p>
        <p>puta has estudiao</p>
        <p><a href="https://www.apagea.com/activar-cuenta?token=TOKEN_DE_ACTIVACION">Activar cuenta</a></p>
        <p>Si no se registró en Apagea, por favor ignore este correo electrónico.</p>
      `
          }
        ]
      })

    request.then((result) => console.log(result.body))

    // 3º paso: devolvemos respuesta al cliente react
    res.status(200)
      .send(
        {
          codigo: 0,
          mensaje: 'datos del cliente insertados ok'
        }
      )
  } catch (error) {
    console.log('error al hacer el insert en coleccion clientes...', error)
    res.status(200).send(
      {
        codigo: 1,
        mensaje: `error a la hora de insertar datos del cliente: ${JSON.stringify(error)}`
      }

    )
  }
})

serverExpress.post('/api/Cliente/Login', async (req, res, next) => {
  try {
    // en req.body esta el objeto q me manda el componente Login.js
    const { email, password } = req.body

    // 1º paso: comprobar si existe el email en mongoDB
    const _resultFindCliente = await Cliente.findOne({ 'cuenta.email': email })
      .populate(
        [
          { path: 'direcciones', model: 'Direccion' },
          { path: 'pedidos', model: 'Pedido' }
        ]
      )
    if (!_resultFindCliente) throw new Error('no existe una cuenta con ese email....')

    // 2º paso: comprobar si la password es correcta
    if (bcrypt.compareSync(password, _resultFindCliente.cuenta.password)) {
      // 3º comprobar q la cuenta esta ACTIVADA...
      if (!_resultFindCliente.cuenta.cuentaActiva) throw new Error('debes activar tu cuenta....comprueba el email')
      // <----deberiamos reenviar email de activacion...

      // 4º generar el token
      const _jwt = jsonwebtoken.sign(
        { nombre: _resultFindCliente.nombre, apellidos: _resultFindCliente.apellidos, email: _resultFindCliente.cuenta.email, idcliente: _resultFindCliente._id }, // <--- payload jwt
        process.env.JWT_SECRETKEY, // <---- clave secreta para firmar jwt y comprobar autenticidad...
        { expiresIn: '1h', issuer: 'http://localhost:3003' } // opciones o lista de cliams predefinidos
      )

      res.status(200).send(
        {
          codigo: 0,
          mensaje: 'login OKS...',
          error: '',
          datoscliente: _resultFindCliente,
          tokensesion: _jwt,
          otrosdatos: null
        }
      )

    } else {
      throw new Error('password incorrecta....')
    }
  } catch (error) {
    console.log('error en el login....', error)
    res.status(200).send(
      {
        codigo: 1,
        mensaje: 'login fallido',
        error: error.message,
        datoscliente: null,
        tokensesion: null,
        otrosdatos: null
      }
    )
  }
})
// #endregion

// #region --------------------- endpoints de la API REST PARTE TIENDA ---------------------

serverExpress.get('/api/Tienda/RecuperarCategorias/:idcategoria', async (req, res, next) => {
  try {
    const _idcategoria = req.params.idcategoria

    const _patron = _idcategoria === 'root' ? /^[0-9]{1,}$/ : new RegExp('^' + _idcategoria + '-.*')

    let _categorias = await Categoria.find({ IdCategoria: { $regex: _patron } })
    if (!_categorias) _categorias = await Categoria.find({ IdCategoria: { $regex: /^[0-9]{1,}$/ } })

    console.log(_categorias)
    res.status(200).send(_categorias)
  } catch (error) {
    console.log('error al recuperar categorias...', error)
    res.status(200).send([])
  }
})

serverExpress.get('/api/Tienda/RecuperarLibros/:idcategoria', async (req, res, next) => {
  try {
    const _idcategoria = req.params.idcategoria

    const _patron = _idcategoria === '2-10' ? /^[0-9-]+$/ : new RegExp('^' + _idcategoria)

    const _libros = await Libro.find({ IdCategoria: { $regex: _patron } })
    res.status(200).send(_libros)
  } catch (error) {
    console.log('error al recuperar libros...', error)
    res.status(200).send([])
  }
})

serverExpress.get('/api/Tienda/RecuperarLibro/:isbn13', async (req, res, next) => {
  try {
    const _isbn13 = req.params.isbn13
    const _libro = await Libro.findOne({ ISBN13: _isbn13 })

    res.status(200).send(_libro)
  } catch (error) {
    console.log('error al recuperar libro...', error)
    res.status(200).send({})
  }
})

// #endregion

serverExpress.listen(3003, () => console.log('...servidor web express escuchando por puerto 3003...'))

// ------------ conexion al servidor MONGODB----------
// OJO!! cadenas de conexion al servidor de BD van en variables de entorno del sistema op. donde se ejecuta el server
// instalar paquete npm:  dotenv
mongoose.connect(process.env.CONNECTION_MONGODB)
  .then(
    () => console.log('...conexion al servidor de BD mongo establecido de forma correcta....')
  )
  .catch(
    (err) => console.log('fallo al conectarnos al sevidor de bd de mongo:', err)
  )
