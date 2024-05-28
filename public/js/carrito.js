document.addEventListener('click', (event) => {
  if (event.target && event.target.className.includes('addToCart')) {
    addToCartClicked(event);
  }
});

document.addEventListener('click', (event) => {
  if (event.target && event.target.className.includes('addToCarritoProd')) {
    addToCartClickedProd(event);
  }
});

/*const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);*/

const shoppingCartItemsContainer = document.querySelector(
  '.shoppingCartItemsContainer'
);

function loadCart() {
  let carritolocal = JSON.parse(localStorage.getItem('shoppingCart'));


  carritolocal.forEach((carritoItem) => {

    const shoppingCartRow = document.createElement('div');

    const shoppingCartContent =
      `
    <div class="product product-cart shoppingCartItem"  data-id=${carritoItem.id}>
                                <figure class="product-media">
                                    <a href="#">
                                        <img src="${carritoItem.img}" alt="product" width="80" height="88" class="imgcart" />
                                    </a>
                                    <button class="btn btn-link btn-close buttonDelete">
                                        <i class="fas fa-times"></i><span class="sr-only ">Cerrar</span>
                                    </button>
                                </figure>
                                <div class="product-detail">
                                    <a href="#" class="product-name shoppingCartItemTitle">${carritoItem.title}</a>
                                    <div class="price-box">
                                        <span class="product-quantity shoppingCartItemQuantity">${carritoItem.qty}</span>
                                        <span class="product-price shoppingCartItemPrice">S/${carritoItem.valor}</span>
                                    </div>
                                </div>

                            </div>`;


    shoppingCartRow.innerHTML = shoppingCartContent;

    shoppingCartItemsContainer.append(shoppingCartRow);

    shoppingCartRow.querySelector('.buttonDelete')
      .addEventListener('click', removeShoppingCartItem);


    updateShoppingCartTotal();
  });
}

loadCart();

function addToCartClicked(event) {

  const button = event.target;
  const item = button.closest('.product');
  

  const idproducto = button.getAttribute('ip');
  const itemTitle = item.querySelector('.nombreproducto').textContent;
  const itemPrice = item.querySelector('.precioproducto').textContent;
  const itemImage = item.querySelector('.imagenproducto').src;
  let itemQty = 1;

  

  addItemToShoppingCart(itemTitle, itemPrice, itemImage, idproducto, itemQty);

}

function addToCartClickedProd(event) {


  const button = event.target;

  const item = button.closest('.product');

  let idproducto = button.getAttribute('ip');
  let itemTitle = item.querySelector('.product-name').textContent;
  let itemPrice = item.querySelector('.pricecrt').textContent;
  let itemImage = document.querySelector('.imgprodz').src;


  let itemQty = document.getElementById("qtyprod").value;
  itemPrice = itemPrice * itemQty;

  addItemToShoppingCart(itemTitle, itemPrice, itemImage, idproducto, itemQty);

}




function addItemToShoppingCart(itemTitle, itemPrice, itemImage, itemId, itemQty) {

  //se guarda nombre,precio,imagen y id en carrito


  const elementsTitle = shoppingCartItemsContainer.getElementsByClassName(
    'shoppingCartItemTitle'
  );

  let reg = "n";

  for (let i = 0; i < elementsTitle.length; i++) {
    if (elementsTitle[i].innerText === itemTitle) {
      let elementQuantity = elementsTitle[
        i
      ].parentElement.parentElement.parentElement.querySelector(
        '.shoppingCartItemQuantity'
      );
      elementQuantity.value++;
      //$('.toast').toast('show');
      updateShoppingCartTotal();
      return;
    }
  }


  if (reg == "n") {

    const shoppingCartRow = document.createElement('div');

    const shoppingCartContent =
      `
    <div class="product product-cart shoppingCartItem"  data-id=${itemId}>
                                <figure class="product-media">
                                    <a href="#">
                                        <img src="${itemImage}" alt="product" width="80" height="88" class="imgcart" />
                                    </a>
                                    <button class="btn btn-link btn-close buttonDelete">
                                        <i class="fas fa-times"></i><span class="sr-only ">Cerrar</span>
                                    </button>
                                </figure>
                                <div class="product-detail">
                                    <a href="#" class="product-name shoppingCartItemTitle">${itemTitle}</a>
                                    <div class="price-box">
                                        <span class="product-quantity shoppingCartItemQuantity">${itemQty}</span>
                                        <span class="product-price shoppingCartItemPrice">S/${itemPrice}</span>
                                    </div>
                                </div>

                            </div>`;


    shoppingCartRow.innerHTML = shoppingCartContent;
    shoppingCartItemsContainer.append(shoppingCartRow);

    shoppingCartRow
      .querySelector('.buttonDelete')
      .addEventListener('click', removeShoppingCartItem);

  }


  /*shoppingCartRow
    .querySelector('.shoppingCartItemQuantity')
    .addEventListener('change', quantityChanged);*/

  updateShoppingCartTotal();
}




function updateShoppingCartTotal() {
  let total = 0;
  let totalunidades = 0;
  const shoppingCartTotal = document.querySelector('.shoppingCartTotal');
  const shoppingCartTotal2 = document.querySelector('.shoppingCartTotal2');
  const shoppingCartUnitTotal = document.querySelector('.shoppingUnitTotal');

  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

  shoppingCartItems.forEach((shoppingCartItem) => {
    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
      '.shoppingCartItemPrice'
    );

    const shoppingCartItemPrice = Number(
      shoppingCartItemPriceElement.textContent.replace('S/', '').trim()
    );

    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
      '.shoppingCartItemQuantity'
    );
    const shoppingCartItemQuantity = Number(
      shoppingCartItemQuantityElement.textContent
    );

    //total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
    total = total + shoppingCartItemPrice;
    totalunidades = totalunidades + shoppingCartItemQuantity;
  });

  shoppingCartTotal.innerHTML = `S/${total.toFixed(2)}`;
  shoppingCartTotal2.innerHTML = `S/${total.toFixed(2)}`;
  shoppingCartUnitTotal.innerHTML = `${totalunidades}`;

  comprarButtonClicked();
}



function removeShoppingCartItem(event) {
  const buttonClicked = event.target;
  buttonClicked.closest('.shoppingCartItem').remove();
  updateShoppingCartTotal();
}

function quantityChanged(event) {
  const input = event.target;
  input.value <= 0 ? (input.value = 1) : null;
  updateShoppingCartTotal();
}

function comprarButtonClicked() {
  const shoppingCartItems = getItemsInShoppingCart();
  addToLocalStorage('shoppingCart', shoppingCartItems);


  //updateShoppingCartTotal();
}

function getItemsInShoppingCart() {
  const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');
  const arrShoppingCartItems = [];

  shoppingCartItems.forEach((shoppingCartItem) => {

    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
      '.shoppingCartItemQuantity'
    );

    const shoppingCartItemQuantity = Number(
      shoppingCartItemQuantityElement.textContent
    );


    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
      '.shoppingCartItemPrice'
    );

    const shoppingCartItemPrice = Number(
      shoppingCartItemPriceElement.textContent.replace('S/', '').trim()
    );


    const shoppingCartItemTitleElement = shoppingCartItem.querySelector(
      '.shoppingCartItemTitle'
    );
    const shoppingCartItemImgElement = shoppingCartItem.querySelector(
      '.imgcart'
    );

    const itemcartTitle = shoppingCartItemTitleElement.textContent.trim();
    const itemcatImage = shoppingCartItemImgElement.src.trim();



    const itemId = shoppingCartItem.dataset.id;

    const item = {
      id: itemId,
      qty: shoppingCartItemQuantity,
      valor: shoppingCartItemPrice,
      title: itemcartTitle,
      img: itemcatImage
    };

    arrShoppingCartItems.push(item);
  });
  return arrShoppingCartItems;
}

function addToLocalStorage(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}
