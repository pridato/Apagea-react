export async function RegistrarCliente({ nombre, apellidos, email, password, login, telefono }) {

  if (login === '') login = email;

  try {

    var _petAjax = await fetch('http://localhost:3003/api/Cliente/Registro',
      {
        method: 'POST',
        body: JSON.stringify({ nombre, apellidos, email, password, login, telefono }),
        headers:
        {
          'Content-Type': 'application/json'
        }
      }
    );

    return await _petAjax.json();

  } catch (error) {
    return { codigo: 1, mensaje: 'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
  }
}

export async function LoginCliente({ email, password }) {

  try {

    var _petAjax = await fetch('http://localhost:3003/api/Cliente/Login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers:
        {
          'Content-Type': 'application/json'
        }
      }
    );

    return await _petAjax.json();

  } catch (error) {
    return { codigo: 1, mensaje: 'algo ha ido mal en pet.ajax al servicio de login cliente...' };
  }
}

