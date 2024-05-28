let campos = "n";

document.addEventListener('change', (event) => {
    if (event.target && event.target.className.includes('region')) {
        getcostoenvio();
    }
});

document.addEventListener('click', (event) => {
    if (event.target && event.target.className.includes('confcamp')) {
        confcampos();
    }
});


document.addEventListener('click', (event) => {
    if (event.target && event.target.className.includes('opcionenvio')) {
        sumatotal();
    }
});

document.addEventListener('click', (event) => {
    if (event.target && event.target.className.includes('btn-pago')) {
        regVentac();
        pagoWeb();
    }
});

const shoppingCartItemsContainer3 = document.querySelector(
    '.cartareac'
);


function confcampos() {
    let nombres = document.getElementById("nombres").value;
    let apellidos = document.getElementById("apellidos").value;

    let nrodocumento = document.getElementById("nrodocumento").value;
    let direccion = document.getElementById("direccion").value;
    let ciudad = document.getElementById("ciudad").value;
    let distrito = document.getElementById("distrito").value;
    let celular = document.getElementById("celular").value;
    let correoelectronico = document.getElementById("correoelectronico").value;

    if ((nombres.length == 0) || (apellidos.length == 0) || (nrodocumento.length == 0) || (direccion.length == 0) || (ciudad.length == 0) || (distrito.length == 0) || (celular.length == 0) || (correoelectronico.length == 0)) {
        alert("Debe llenar todos los campos obligatorios");
        campos = "n";



    } else {
        campos = "s";
        let x = document.getElementById("cenv");
        x.style.display = "block";
    }

    pagoWeb();
}


function getcostoenvio() {
    let region = document.getElementById("region").value;
    let cant = document.querySelector('.sumund').textContent;

    axios.post('/getCostoEnvio?region=' + region + '&cant=' + cant)
        .then(function (response) {
            let campocostoenvio = document.querySelector('.campocostoenvio');
            //campocostoenvio.innerHTML(`S/${response.data.costoenvio}`);
            campocostoenvio.textContent = `S/${response.data.costoenvio}`;
            sumatotal();
            pagoWeb();
            //alert(response.data.costoenvio);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function sumatotal() {
    let sumatotal = 0;

    let shoppingCartItemPriceElement = document.querySelector(
        '.summary-subtotal-price'
    );

    let shoppingCartItemPrice = Number(
        shoppingCartItemPriceElement.textContent.replace('S/', '').trim()
    );

    if (document.getElementById('enviodomicilio').checked) {

        let costoenvio = document.querySelector(
            '.campocostoenvio'
        );

        let costoenvionum = Number(
            costoenvio.textContent.replace('S/', '').trim()
        );

        sumatotal = shoppingCartItemPrice + costoenvionum;

        let x = document.getElementById("camporecojotienda");
        x.style.display = "none";
        campos = "s";

    } else if (document.getElementById('recojoentienda').checked) {
        sumatotal = shoppingCartItemPrice;

        let x = document.getElementById("camporecojotienda");
        x.style.display = "table";
        campos = "s";

    } else {
        let x = document.getElementById("camporecojotienda");
        x.style.display = "none";
        campos = "n";
    }

    let campofinal = document.querySelector('.summary-total-price');

    campofinal.textContent = `S/${sumatotal}`;

    pagoWeb();


}

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function loadCartCheckout() {
    let carritolocal = JSON.parse(localStorage.getItem('shoppingCart'));
    let suma = 0;
    let sumaunidades = 0;

    carritolocal.forEach((carritoItem) => {

        const shoppingCartRow = document.createElement('tr');

        const shoppingCartContent =
            `<tr>
                <td class="product-name">${carritoItem.title} <span class="product-quantity">×&nbsp;${carritoItem.qty}</span></td>
                <td class="product-total text-body">S/${carritoItem.valor}</td>
            </tr>`;

        suma = suma + carritoItem.valor;
        suma = roundToTwo(suma);

        sumaunidades = sumaunidades + carritoItem.qty;


        shoppingCartRow.innerHTML = shoppingCartContent;

        shoppingCartItemsContainer3.append(shoppingCartRow);

    });

    const Subtotalrow = document.createElement('tr');
    const shoppingCartSubtotal =
        `<tr class="summary-subtotal">
            <td>
                <h4 class="summary-subtitle">Unidades Totales</h4>
            </td>
            <td class=" pb-0 pt-0 sumund">${sumaunidades}
            </td>
        </tr>`;

    Subtotalrow.innerHTML = shoppingCartSubtotal;
    shoppingCartItemsContainer3.append(Subtotalrow);


    const Subtotalrow2 = document.createElement('tr');
    const shoppingCartSubtotal2 =
        `<tr class="summary-subtotal">
            <td>
                <h4 class="summary-subtitle">Subtotal</h4>
            </td>
            <td class="summary-subtotal-price pb-0 pt-0">S/${suma}
            </td>
        </tr>`
        ;

    Subtotalrow2.innerHTML = shoppingCartSubtotal2;
    shoppingCartItemsContainer3.append(Subtotalrow2);

    sumatotal('domicilio');
}


function pagoWeb() {

    let campomontofinal = document.querySelector(
        '.mtfn'
    );

    let montofinal = Number(
        campomontofinal.textContent.replace('S/', '').trim()
    );

    montofinal = montofinal.toFixed(2);



    



}


function regVentac() {

    let nombres = document.getElementById("nombres").value;
    let apellidos = document.getElementById("apellidos").value;
    let nombreempresa = document.getElementById("nombreempresa").value;
    let nrodocumento = document.getElementById("nrodocumento").value;
    let pais = document.getElementById("pais").value;
    let direccion = document.getElementById("direccion").value;
    let nrodireccion = document.getElementById("nrodireccion").value;
    let ciudad = document.getElementById("ciudad").value;
    let region = document.getElementById("region").value;
    let distrito = document.getElementById("distrito").value;
    let celular = document.getElementById("celular").value;
    let correoelectronico = document.getElementById("correoelectronico").value;
    let observaciones = document.getElementById("observaciones").value;

    let carritolocal = JSON.parse(localStorage.getItem('shoppingCart'));

    let costoenvio = document.querySelector(
        '.campocostoenvio'
    );

    let costoenvionum = Number(
        costoenvio.textContent.replace('S/', '').trim()
    );

    

    let tipoenvio = document.querySelector('input[name="tipoenvio"]:checked').value;
    let idsucursalrecojo = 0;
    if (tipoenvio == 2) {
        idsucursalrecojo = document.getElementById("idsucursalrecojo").value;
        costoenvio = "0";
    }

    let montototal = document.querySelector(
        '.summary-total-price'
    );

    let montototalnum = Number(
        montototal.textContent.replace('S/', '').trim()
    );
    


    let datajson = {
        nombres: nombres,
        apellidos: apellidos,
        nombreempresa: nombreempresa,
        nrodocumento: nrodocumento,
        pais: pais,
        direccion: direccion,
        nrodireccion: nrodireccion,
        ciudad: ciudad, 
        region: region,
        distrito: distrito, 
        celular: celular,
        correoelectronico: correoelectronico,
        observaciones: observaciones,
        listaventa: carritolocal,
        costoenvio: costoenvionum,
        tipoenvio: tipoenvio,
        idclienteweb: ic,
        idsucursalrecojo: idsucursalrecojo,
        idtipodocumento: 1,
        montototal: montototalnum
    };

    const envio = JSON.stringify(datajson);

    axios.post('/regVenta', {
        headers: {
            'Content-Type': 'application/json'
        },
        envio
    })
        .then((response) => {

            window.localStorage.removeItem('shoppingCart');
            getItemsInShoppingCart();


            document.querySelector('.divvn').style.display = "none";
            document.querySelector('.divcn').style.display = "block";

            document.getElementById('nrov').innerHTML = response.data.nropedido;
            document.getElementById('fechav').innerHTML = response.data.fechapedido;
            document.getElementById('emailv').innerHTML = response.data.email;
            document.getElementById('totalv').innerHTML = response.data.montototal;
            document.getElementById('direccionv').innerHTML = response.data.direccion;

            document.querySelector('.shoppingCartTotal').innerHTML = "S/0.00";
            document.querySelector('.cart-count').innerHTML = "0";
            loadCart();

        })
        .catch((error) => {
            console.log(error);
        })

}


loadCartCheckout();
getcostoenvio();
pagoWeb();



function correoprueba() {

    axios.post('/correoprueba')
        .then(function (response) {
            //console.log(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });

}


/*
KR.onSubmit(function (event) {

    if (event.clientAnswer.orderStatus === "PAID") {
        regVentac();
        KR.closePopin();
        return true;
    } else {
        // Show error message to the user
        alert("Payment failed !");
        return false;
    }

});*/

