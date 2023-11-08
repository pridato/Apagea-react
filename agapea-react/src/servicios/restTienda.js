
var tiendaRESTService = {
    recuperarCategorias: async function( { request, params }) 
    {
      try {
        var _idcategoria=params.idcategoria;
        if( typeof(_idcategoria)==='undefined') _idcategoria='root';
        
        var _cats=await fetch(`http://localhost:3003/api/Tienda/RecuperarCategorias/${_idcategoria}`);
        return  await _cats.json();
      } catch(error) {
        console.log('error al recuperar categorias...', error) 
        return []
      }
    },

    recuperarLibros: async function( { request, params }) 
    {
      try 
      {
        
        var _idcategoria= ( typeof params.idcategoria ==='undefined') ? params.idcategoria = '2-10' : params.idcategoria ;

        var _libros = await fetch(`http://localhost:3003/api/Tienda/RecuperarLibros/${_idcategoria}`);
        return await _libros.json();
      } 
      catch(error) 
      {
        console.log('error al recuperar libros...', error)
        return []
      }
    },

    recuperarLibro: async function( isbn13) {
      try {

          var _libro = await fetch(`http://localhost:3003/api/Tienda/RecuperarLibro/${isbn13}`);
          return await _libro.json();
      } catch(error) {
        console.log('error al recuperar libro...', error)
        return {}
      }
    },
    recuperarCarrito: async function( { request, params }) {
      try {
        
        const pedidos = []
        return pedidos
      } catch (error) {
        return []
      }
  }
}

export default tiendaRESTService;