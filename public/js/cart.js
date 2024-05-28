const shoppingCartItemsContainer2 = document.querySelector(
    '.cartarea'
);

function loadCartArea() {
    let carritolocal = JSON.parse(localStorage.getItem('shoppingCart'));

    carritolocal.forEach((carritoItem) => {

        const shoppingCartRow = document.createElement('tr');

        const shoppingCartContent =
            `<tr data-id=${carritoItem.id}>
                                            <td class="product-close">
                                                <a href="#" class="product-remove" title="Remove this product">
                                                    <i class="fas fa-times"></i>
                                                </a>
                                            
                                            </td>
                                            <td class="product-thumbnail">
                                                <figure>
                                                    <a href="product-simple.html">
                                                        <img src="${carritoItem.img}" width="100"
                                                            height="100" alt="product">
                                                    </a>
                                                </figure>
                                            </td>
                                            <td class="product-name">
                                                <div class="product-name-section">
                                                    <a href="#">${carritoItem.title}</a>
                                                </div>
                                            </td>
                                            <td class="product-subtotal">
                                                <span class="amount">S/${carritoItem.valor / carritoItem.qty}</span>
                                            </td>
                                            <td class="product-quantity">
                                                <div class="input-group">
                                                    <button class="quantity-minus d-icon-minus"></button>
                                                    <input class="quantity form-control" type="number" min="1"
                                                        max="10" value="${carritoItem.qty}">
                                                    <button class="quantity-plus d-icon-plus"></button>
                                                </div>
                                            </td>
                                            <td class="product-price">
                                                <span class="amount">S/${carritoItem.valor}</span>
                                            </td>
                                            
                                            </tr>`;


        shoppingCartRow.innerHTML = shoppingCartContent;

        shoppingCartItemsContainer2.append(shoppingCartRow);

        shoppingCartRow.querySelector('.product-remove')
            .addEventListener('click', removeShoppingCartItem);


        updateShoppingCartTotal2();
    });
}

loadCartArea();