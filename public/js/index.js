let novedades = '';



  const cargarNovedades = async() => {
	try {
		const respuesta = await axios.get(`http://127.0.0.1:3000/novedades`);
	
		// console.log(respuesta);

		// Si la respuesta es correcta
		if(respuesta.status === 200){
            //alert(respuesta.data[0].nombre);
			const datos = await respuesta.data;
			datos.forEach(producto => {
				novedades += `

                <div class="product text-center bcp">
                                    <figure class="product-media">
                                        <a href="product.html">
                                            <img src="pruebas/producto1.png" alt="Prueba 1" width="280" height="315"
                                                style="background-color: #f2f3f5;" />
                                        </a>
                                        <div class="product-label-group">
                                            <label class="product-label label-new">Nuevo</label>
                                        </div>
                                        <div class="product-action-vertical">
                                            <a href="#" class="btn-product-icon btn-wishlist" title="Add to wishlist"><i
                                                    class="d-icon-heart"></i></a>
                                        </div>
                                        <div class="product-action">
                                        </div>
                                    </figure>
                                    <div class="product-details">
                                        <h3 class="product-name">
                                            <a href="product.html">${producto.nombre}</a>
                                        </h3>
                                        <div class="product-price">
                                            <span class="price">S/ ${producto.precio}</span>
                                        </div>

                                    </div>
                                    <div class="product-details campoadd">
                                        <div class="">
                                            <span>Añadir al carrito</span>
                                        </div>
                                    </div>
                                </div>
				`;
			});

			document.getElementById('listanovedades').innerHTML = novedades;

		} else if(respuesta.status === 401){
			console.log('Pusiste la llave mal');
		} else if(respuesta.status === 404){
			console.log('La pelicula que buscas no existe');
		} else {
			console.log('Hubo un error y no sabemos que paso');
		}

	} catch(error){
		console.log(error);
	}

}

cargarNovedades();