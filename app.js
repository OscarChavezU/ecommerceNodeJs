const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const axios = require('axios');
const methodOverride = require('method-override');
const nodemailer = require("nodemailer");

const app = express();
const path = require("path");
const cors = require("cors");

require('dotenv').config();
const apiUrl = process.env.API_URL;
const pwEmail = process.env.PW_EMAIL;
const pwSession = process.env.PW_SESSION;


//settings
//app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


//middleware
//app.use('/categoria', );
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(pwSession));
app.use(session({
  secret: pwSession,
  resave: false,
  saveUnitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

passport.use(new PassportLocal(function (username, password, done) {
  //aqui revisa si es que se puede loguear

  axios.post(apiUrl+'ws/getUsuario', {
    correo: username,
    password: password
  })
    .then(function (response) {

      if (response.data.idclienteweb != 0) {
        return done(null, { idcliente: response.data.idclienteweb, name: response.data.nombres });
      } else {
        done(null, false);
      }


    })
    .catch(function (error) {

      done(null, false);
    });

}));

//serializa para solo guardar idcliente
passport.serializeUser(function (user, done) {
  done(null, user);
});

//desserializacion para recuperar datos de idcliente
passport.deserializeUser(function (id, done) {
  //aqui se hace la consulta post a ApiCohem
  done(null, id);
});


app.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/"
}));



app.post('/registeru', async (req, res) => {

  let nombres = req.body.nombres;
  let apellidos = req.body.apellidos;
  let nrodocumento = req.body.nrodocumento;
  let correo = req.body.username;
  let contra = req.body.password;

  axios.post(apiUrl+'ws/regUsuario', {
    nombres: nombres,
    apellidos: apellidos,
    nrodocumento: nrodocumento,
    correo: correo,
    password: contra
  })
    .then(async function (response) {

      let transporter = nodemailer.createTransport({
        host: "mail.cohemgames.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'ventaweb@cohemgames.com', // ethereal user
          pass: pwEmail, // ethereal password
        },
      });

      const msg = { 
        from: '"Ventas Web" <ventaweb@cohemgames.com>', // sender address
        to: `${correo}`, // list of receivers
        subject: "Registro Exitoso", // Subject line
        text: `Hola ${correo}, tu registro en cohemgames.com fue exitoso.`, // plain text body
      }
      // send mail with defined transport object
      const info = await transporter.sendMail(msg);
      console.log(info);

      req.login({ username: correo, password: contra, idcliente: response.data.idclienteweb, name: response.data.nombres }, function (err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });

    })
    .catch(function (error) {
      console.log(error);
      res.redirect('/');
    });
});


app.post("/regVenta", async (req, res) => {

  console.log(req.body.envio);
  let dataenvio = JSON.parse(req.body.envio);
  let dataenviofinal = JSON.stringify(dataenvio);

  console.log(JSON.stringify(dataenvio));
  console.log(dataenvio.nombres);

  try {
    const respuesta = await axios({
      url: apiUrl+"ws/regVenta",
      data: dataenviofinal,
      headers: {
        'Content-Type': 'application/json'
      },
      method: "post"
    }).then(async function (response) {

      let nropedido = response.data;

      let transporter = nodemailer.createTransport({
        host: "mail.cohemgames.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'ventaweb@cohemgames.com', // ethereal user
          pass: pwEmail, // ethereal password
        },
      });


      let tablaproductos =
        `
    <table>
    <tr>
      <th></th>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Valor</th>
    <tr>
    `;

      let carritolocal = dataenvio.listaventa;
      carritolocal.forEach((carritoItem) => {
        tablaproductos +=
          `
    <tr>
      <td><img src="${carritoItem.img}" alt="product" width="80" height="88" class="imgcart" /></td>
      <td>${carritoItem.title}</td>
      <td>${carritoItem.qty}</td>
      <td>${carritoItem.valor}</td>
    <tr>
    `;
      });
      tablaproductos += "</table>";




      let textohtml = "";

      if (dataenvio.tipoenvio == "1") {//envio a domicilio
        textohtml = `¡¡Hola ${dataenvio.nombres} !<br>
      Te enviamos el comprobante de pago de tu compra web PEDIDO Nº ${nropedido},  con la cual podrás recepcionar tu paquete cuando llegue a tu domicilio.<br>
      Recuerda que tu pedido estará arribando dentro de 3 a 4 días hábiles desde el día de tu compra.<br>
      La distribución de tu pedido es nuestra prioridad, nos estaremos comunicando contigo previamente a la entrega de tu pedido.<br>
      Cualquier consulta que tengas puedes realizarlo a nuestro whatsapp 990707664 de Lunes a Viernes en el horario de 10:00 am a 6:00 pm.
      
      <h2>Detalle del Pedido:</h2><br>
      ${tablaproductos}

      Muchas gracias por su preferencia<br>
      Atentamente<br>
      Cohem Games`;
      } else if (dataenvio.tipoenvio == "2") {//recoger en tienda
        let nombretienda = "";
        if (dataenvio.idsucursalrecojo == "1") {
          nombretienda = "Almacen Central";
        } else if (dataenvio.idsucursalrecojo == "5") {
          nombretienda = "C.C Arenales";
        } else if (dataenvio.idsucursalrecojo == "6") {
          nombretienda = "C.C Mega Plaza";
        } else if (dataenvio.idsucursalrecojo == "7") {
          nombretienda = "C.C.Mega Plaza Huaral";
        } else if (dataenvio.idsucursalrecojo == "9") {
          nombretienda = "C.C.Real Plaza Pro";
        }

        textohtml = `¡Hola ${dataenvio.nombres}!<br>
      Te enviamos el comprobante por el pedido nº ${nropedido} con la cual podrás recoger tu pedido pasando 3 días hábiles del día de compra en tu tienda seleccionada del ${nombretienda}<br>
      
      La distribución de tu pedido es nuestra prioridad,  nos estaremos comunicando contigo en caso de tener tu pedido listo antes de la fecha establecida.<br>
      Cualquier consulta que tengas recuerda que puedes escribirnos a nuestro whatsapp del 990 707 664 de Lunes a Viernes en el horario de 10:00 am - 6:00 pm.<br>

      <h2>Detalle del Pedido:</h2><br>
      ${tablaproductos}
      <br>
      Muchas gracias por su preferencia.<br>
      Atentamente<br>
      Cohem Games`;
      }

      const msg = {
        from: '"Ventas Web" <ventaweb@cohemgames.com>', // sender address
        to: `${dataenvio.correoelectronico}`, // list of receivers
        subject: `Registro Pedido N° ${nropedido}`, // Subject line
        html: textohtml, // plain text body
      }
      // send mail with defined transport object
      const info = await transporter.sendMail(msg);

      let date_ob = new Date();
      // current date
      // adjust 0 before single digit date
      let date = ("0" + date_ob.getDate()).slice(-2);
      // current month
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      // current year
      let year = date_ob.getFullYear();
      let hoy = year + "-" + month + "-" + date;

      let inforesp = {
        nropedido: nropedido,
        fechapedido: hoy,
        email: dataenvio.correoelectronico,
        montototal: dataenvio.montototal,
        direccion: dataenvio.direccion,
        auth: ''
      };

      res.status(200).json(inforesp);

    })
      .catch(function (error) {
        console.log(error);
        res.redirect('/');
      });


  } catch (err) {
    res.status(500).json({ message: err });
  }
});



app.delete('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//routes
app.use(require('./routes/index.js'));

//static files
app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(0, () => {
  console.log('Example app listening at http://localhost:', server.address().port);
});
