// Login check
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "client") {
    window.location.href = "login.html";
}

// Customer name display
document.getElementById("customerName").innerText =
    currentUser.firstName + " " + currentUser.lastName;


// Cart display function
function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartContainer = document.getElementById("cartContainer");

    let cartCount = document.getElementById("cartCount");

    let subtotalElement = document.getElementById("subtotal");

    let totalElement = document.getElementById("total");

    let checkoutBtn = document.getElementById("checkoutBtn");

    cartContainer.innerHTML = "";

    let subtotal = 0;
    let totalQuantity = 0;

    // Cart empty check
    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your Cart is Empty!</h3>
                <p>You have not added any products yet.</p>
                <a href="products-list.html">Shop Now</a>
            </div>
        `;

        cartCount.innerText = "0";
        subtotalElement.innerText = "₹0";
        totalElement.innerText = "₹0";
        checkoutBtn.disabled = true;

        return;
    }

    checkoutBtn.disabled = false;

    // Display cart products
    for (let i = 0; i < cart.length; i++) {

        let product = cart[i];

        let itemSubtotal = product.price * product.quantity;

        subtotal = subtotal + itemSubtotal;

        totalQuantity = totalQuantity + product.quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">

                <img src="${product.image || 'https://placehold.co/200x200?text=Product'}"
                     alt="${product.name}">

                <div class="item-info">

                    <h3>${product.name}</h3>

                    <p class="item-price">
                        ₹${product.price}
                    </p>

                    <div class="quantity-control">

                        <button onclick="changeQuantity(${product.productId}, -1)">
                            -
                        </button>

                        <span>${product.quantity}</span>

                        <button onclick="changeQuantity(${product.productId}, 1)">
                            +
                        </button>

                    </div>

                </div>

                <div class="item-subtotal">
                    ₹${itemSubtotal}
                </div>

                <button class="remove-btn"
                    onclick="removeItem(${product.productId})">
                    Remove
                </button>

            </div>
        `;
    }

    cartCount.innerText = totalQuantity;

    subtotalElement.innerText = "₹" + subtotal;

    // Shipping is free, so total equals subtotal
    totalElement.innerText = "₹" + subtotal;
}


// Quantity increase and decrease function
function changeQuantity(productId, change) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let products = JSON.parse(localStorage.getItem("products")) || [];

    for (let i = 0; i < cart.length; i++) {

        if (cart[i].productId == productId) {

            let newQuantity = cart[i].quantity + change;

            // Find actual product stock
            let selectedProduct = null;

            for (let j = 0; j < products.length; j++) {

                if (products[j].id == productId) {
                    selectedProduct = products[j];
                    break;
                }
            }

            // Decrease quantity
            if (newQuantity < 1) {
                alert("Minimum quantity is 1.");
                return;
            }

            // Check available stock
            if (selectedProduct && newQuantity > Number(selectedProduct.stock)) {
                alert("Sorry! Only " + selectedProduct.stock + " products are available.");
                return;
            }

            // Update quantity
            cart[i].quantity = newQuantity;

            break;
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}


// Remove cart item function
function removeItem(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let newCart = [];

    for (let i = 0; i < cart.length; i++) {

        if (cart[i].productId != productId) {
            newCart.push(cart[i]);
        }
    }

    localStorage.setItem("cart", JSON.stringify(newCart));

    displayCart();
}


// Checkout button
function goToCheckout() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Checkout page will be created in next module
    window.location.href = "checkout.html";
}


// Logout function
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// Display cart when page loads
displayCart();