// Login check
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "client") {
    window.location.href = "login.html";
}

// Customer name display
document.getElementById("customerName").innerText =
    currentUser.firstName + " " + currentUser.lastName;


// Get cart and products
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let products = JSON.parse(localStorage.getItem("products")) || [];


// Cart empty check
if (cart.length === 0) {

    alert("Your cart is empty!");

    window.location.href = "cart.html";
}


// Fill customer details
document.getElementById("fullName").value =
    currentUser.firstName + " " + currentUser.lastName;

document.getElementById("email").value = currentUser.email;


// Display order summary
function displayCheckoutItems() {

    let checkoutItems = document.getElementById("checkoutItems");

    let subtotal = 0;

    checkoutItems.innerHTML = "";

    for (let i = 0; i < cart.length; i++) {

        let item = cart[i];

        let itemTotal = Number(item.price) * Number(item.quantity);

        subtotal = subtotal + itemTotal;

        checkoutItems.innerHTML += `
            <div class="checkout-item">

                <div>
                    <strong>${item.name}</strong>
                    <p>Quantity: ${item.quantity}</p>
                </div>

                <strong>₹${itemTotal}</strong>

            </div>
        `;
    }

    document.getElementById("subtotal").innerText = "₹" + subtotal;

    document.getElementById("total").innerText = "₹" + subtotal;
}


// Place order
document.getElementById("checkoutForm").addEventListener("submit", function(event) {

    event.preventDefault();

    // Get latest cart and products from localStorage
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    products = JSON.parse(localStorage.getItem("products")) || [];

    if (cart.length === 0) {

        alert("Your cart is empty!");

        window.location.href = "cart.html";

        return;
    }

    // Get form values
    let customerName = document.getElementById("fullName").value.trim();

    let email = document.getElementById("email").value.trim();

    let phone = document.getElementById("phone").value.trim();

    let address = document.getElementById("address").value.trim();

    let city = document.getElementById("city").value.trim();

    let postalCode = document.getElementById("postalCode").value.trim();

    let paymentMethod = document.getElementById("paymentMethod").value;


    // Check stock and create order items
    let orderItems = [];

    let totalAmount = 0;

    for (let i = 0; i < cart.length; i++) {

        let cartItem = cart[i];

        let foundProduct = null;

        for (let j = 0; j < products.length; j++) {

            if (products[j].id == cartItem.productId) {

                foundProduct = products[j];

                break;
            }
        }

        // Product availability check
        if (foundProduct === null) {

            alert(cartItem.name + " is no longer available.");

            return;
        }

        // Stock check
        if (Number(foundProduct.stock) < Number(cartItem.quantity)) {

            alert("Only " + foundProduct.stock + " units of " +
                  foundProduct.name + " are available. Please update your cart.");

            return;
        }

        let quantity = Number(cartItem.quantity);

        let price = Number(foundProduct.price);

        let itemSubtotal = price * quantity;

        totalAmount = totalAmount + itemSubtotal;

        orderItems.push({
            productId: foundProduct.id,
            name: foundProduct.name,
            price: price,
            quantity: quantity,
            subtotal: itemSubtotal
        });
    }


    // Create order object
    let order = {

        id: "ORD" + Date.now(),

        customerId: currentUser.id,

        customerName: customerName,

        customerEmail: email,

        phone: phone,

        address: address,

        city: city,

        postalCode: postalCode,

        paymentMethod: paymentMethod,

        items: orderItems,

        totalAmount: totalAmount,

        status: "Pending",

        createdAt: new Date().toISOString()
    };


    // Get existing orders
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Add new order
    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));


    // Reduce product stock
    for (let i = 0; i < cart.length; i++) {

        for (let j = 0; j < products.length; j++) {

            if (products[j].id == cart[i].productId) {

                products[j].stock =
                    Number(products[j].stock) - Number(cart[i].quantity);

                break;
            }
        }
    }

    localStorage.setItem("products", JSON.stringify(products));


    // Clear cart
    localStorage.removeItem("cart");

    alert("Your order has been placed successfully!");

    // Redirect to My Orders page
    window.location.href = "my-orders.html";

});


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// Display items
displayCheckoutItems();