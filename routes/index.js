const express = require('express');

const axios = require('axios');
const router = express.Router();

require('dotenv').config();
const apiUrl = process.env.API_URL;
const userIziPay = process.env.API_URL;
const pwIziPay = process.env.PW_IZIPAY;
const cloudName = process.env.CLOUD_NAME;
const cloudSecret = process.env.CLOUD_SECRET;
const cloudApi = process.env.CLOUD_API;



const cloudinary = require('cloudinary').v2;

cloudinary.config({
	secure: true,
	cloud_name: cloudName,
	api_key: cloudApi,
	api_secret: cloudSecret
});


//consulta y muestra la data en páginas
router.get('/', async (req, res) => {

	let listanovedades = await axios({
		url: apiUrl+"ws/ListaNovedades",
		
		method: "get"
	});

	let listamasvendidos = await axios({
		url: apiUrl+"ws/ListaMasvendidos",
		method: "get"
	});

	let listaofertas = await axios({
		url: apiUrl+"ws/ListaOfertas",
		method: "get"
	});

	listanovedades.data.forEach((novedad) => {

		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${novedad.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		novedad.urlfoto = url2;
	});

	listamasvendidos.data.forEach((masvendidos) => {

		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${masvendidos.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		masvendidos.urlfoto = url2;
	});

	listaofertas.data.forEach((oferta) => {

		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${oferta.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		oferta.urlfoto = url2;
	});

	if (req.isAuthenticated()) {
		res.render('index',
			{
				novedades: listanovedades.data,
				listamasvendidos: listamasvendidos.data,
				listaofertas: listaofertas.data,
				datacliente: req.user
			});
	} else {
		res.render('index',
			{
				novedades: listanovedades.data,
				listamasvendidos: listamasvendidos.data,
				listaofertas: listaofertas.data,
				datacliente: null
			});
	}


});


router.get('/producto/:idproducto/:nombre/:codigobarra', async (req, res) => {
	let idproducto = req.params.idproducto;
	if (isNaN(idproducto)) {
		idproducto = 0;
	}
	let infoproducto = await axios({
		url: apiUrl+"ws/Producto/" + idproducto,
		method: "post"
	});

	let numero = 1;
	let codigobarra = infoproducto.data.codigobarra;
	infoproducto.data.listafotos.forEach((foto) => {

		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_1200,w_1200/cohem/${codigobarra}-${numero}.jpg`, { width: 1200, height: 1200, crop: "fill" });
		foto.urlfoto = url2;
		numero = parseInt(numero)+1;
	});

	

	if (req.isAuthenticated()) {
		res.render('producto',
			{
				infoproducto: infoproducto.data,
				datacliente: req.user
			});
	} else {
		res.render('producto',
			{
				infoproducto: infoproducto.data,
				datacliente: null
			});
	}

});

router.get('/categoria/:idcategoria/:categoria', async (req, res) => {
	let idcategoria = req.params.idcategoria;
	let categoria = req.params.categoria;
	if (isNaN(idcategoria)) {
		idcategoria = 0;
	}
	let listaproductos = await axios({
		url: apiUrl+"ws/Categoria/" + idcategoria,
		method: "post"
	});

	listaproductos.data.forEach((novedad) => {

		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${novedad.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		novedad.urlfoto = url2;
	});

	if (req.isAuthenticated()) {
		res.render('categoria',
			{
				listaproductos: listaproductos.data,
				categoria:categoria,
				datacliente: req.user
			});
	} else {
		res.render('categoria',
			{
				listaproductos: listaproductos.data,
				categoria:categoria,
				datacliente: null
			});
	}
});

router.get('/scategoria/:idcategoria/:categoria', async (req, res) => {
	let idcategoria = req.params.idcategoria;
	let categoria = req.params.categoria;
	if (isNaN(idcategoria)) {
		idcategoria = 0;
	}
	let listaproductos = await axios({
		url: apiUrl+"ws/SCategoria/" + idcategoria,
		method: "post"
	});

	listaproductos.data.forEach((novedad) => {

		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${novedad.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		novedad.urlfoto = url2;
	});

	if (req.isAuthenticated()) {
		res.render('categoria',
			{
				listaproductos: listaproductos.data,
				categoria:categoria,
				datacliente: req.user
			});
	} else {
		res.render('categoria',
			{
				listaproductos: listaproductos.data,
				categoria:categoria,
				datacliente: null
			});
	}
});


router.get('/tcategoria/:idcategoria/:categoria', async (req, res) => {
	let idcategoria = req.params.idcategoria;
	let categoria = req.params.categoria;
	if (isNaN(idcategoria)) {
		idcategoria = 0;
	}
	let listaproductos = await axios({
		url: apiUrl+"ws/TCategoria/" + idcategoria,
		method: "post"
	});

	listaproductos.data.forEach((novedad) => {

		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${novedad.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		novedad.urlfoto = url2;
	});

	if (req.isAuthenticated()) {
		res.render('categoria',
			{
				listaproductos: listaproductos.data,
				categoria:categoria,
				datacliente: req.user
			});
	} else {
		res.render('categoria',
			{
				listaproductos: listaproductos.data,
				categoria:categoria,
				datacliente: null
			});
	}
});


router.get('/carrito', async (req, res) => {
	res.render('carrito');
});

router.get('/checkout', async (req, res) => {

	

	let data = userIziPay + ':' + pwIziPay;
	let base64data = Buffer.from(data).toString('base64');
	
	try {
		const response = await axios.post("https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment", {
			headers: {
				'Authorization': `Basic ${base64data}`
			}
		});
		

		if (req.isAuthenticated()) {
			res.render('checkout',
				{
					datacliente: req.user,
					idcliente: req.user.idcliente,
					auth: response.data
				});
		} else {
			res.render('checkout',
				{
					datacliente: null,
					idcliente: 0,
					auth: response.data
				});
		}


	} catch (err) {
		//res.status(500).json({ message: err });
		
		//res.render('checkout');

		if (req.isAuthenticated()) {
			res.render('checkout',
				{
					datacliente: req.user,
					auth: ''
				});
		} else {
			res.render('checkout',
				{
					datacliente: null,
					auth: ''
				});
		}

	}

});




router.get('/complete', async (req, res) => {
	res.render('complete');
});


router.get('/search', async (req, res) => { 
	let ntt = req.query.Ntt;

	const listaproductos = await axios({
		url: apiUrl+"ws/Busqueda/" + ntt,
		method: "get"
	});

	listaproductos.data.forEach((novedad) => {
		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${novedad.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		novedad.urlfoto = url2;
	});

	if (req.isAuthenticated()) {
		res.render('search',
			{
				datacliente: req.user,
				listaproductos: listaproductos.data,
				auth: ''
			});
	} else {
		res.render('search',
			{
				datacliente: null,
				listaproductos: listaproductos.data,
				auth: ''
			});
	}

});


router.get('/ofertas', async (req, res) => { 

	let listaofertas = await axios({
		url: apiUrl+"ws/ListaOfertas",
		method: "get"
	});
	
	listaofertas.data.forEach((oferta) => {
	
		let url2 = cloudinary.url(`https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_600,w_600/cohem/${oferta.codigobarra}-1.jpg`, { width: 600, height: 600, crop: "fill" });
		oferta.urlfoto = url2;
	});

	if (req.isAuthenticated()) {
		res.render('ofertas',
			{
				datacliente: req.user,
				listaproductos: listaofertas.data,
				auth: ''
			});
	} else {
		res.render('ofertas',
			{
				datacliente: null,
				listaproductos: listaofertas.data,
				auth: ''
			});
	}

});




router.post("/getCostoEnvio", async (req, res) => {
	let region = req.query.region;
	let cant = req.query.cant;

	try {
		const response = await axios({
			url: apiUrl+"ws/getCostoEnvio",
			//url: "http://44.238.58.209:8080/ApiCohem/webresources/Documentos/getCostoEnvio",
			data: {
				region: region,
				cantidad: cant
			},
			method: "post"
		});
		res.status(200).json(response.data);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});





router.post("/getToken", async (req, res) => {
	let montofinal = req.query.monto;
	let correoelectronico = req.query.correoelectronico;
	
	montofinal = montofinal.replace('.', '')
	//montofinal = 1800;
	
	try {

		let dataf = {
			"currency": "PEN",
			"amount": montofinal,
			"customer": {
				"email": correoelectronico
			},
			"orderId": "0000"
		};

		let data = userIziPay + ':' + pwIziPay;
		let base64data = Buffer.from(data).toString('base64');

		let codaut2 = "Basic " + base64data;


		const response = await axios({
			url: "https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': codaut2
			},
			data: dataf,
			method: "post"
		});

		res.status(200).json(response.data.answer.formToken);

	} catch (err) {
		res.status(500).json({ message: err });
	}
});




//consigue json para consultas javascript
router.get("/novedades", async (req, res) => {
	try {
		const response = await axios({
			url: apiUrl+"ws/ListaNovedades",
			method: "get"
		});
		res.status(200).json(response.data);
	} catch (err) {
		res.status(500).json({ message: err });
	}
});




module.exports = router;


