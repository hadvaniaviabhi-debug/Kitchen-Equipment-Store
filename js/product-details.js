
// Check Customer Login
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "client") {
    window.location.href = "login.html";
}

// Display Customer Name
document.getElementById("customerName").innerText =
    currentUser.firstName;


// Get Products from LocalStorage
let products = JSON.parse(localStorage.getItem("products")) || [];


// Get Product ID from URL
let urlParams = new URLSearchParams(window.location.search);

let productId = Number(urlParams.get("id"));


// Find Selected Product
let selectedProduct = products.find(function(product) {
    return product.id === productId;
});


// Display Product Details
function displayProductDetails() {

    if (!selectedProduct) {

        document.querySelector(".details-section").innerHTML = `
            <div class="product-info">
                <h2>Product Not Found</h2>
                <p>Please select a valid product.</p>
                <br>
                <a href="products-list.html">Back to Products</a>
            </div>
        `;

        return;
    }

    document.getElementById("productImage").src =
        selectedProduct.image || "https://via.placeholder.com/400";

    document.getElementById("productName").innerText =
        selectedProduct.name;

    document.getElementById("productCategory").innerText =
        selectedProduct.category;

    document.getElementById("productPrice").innerText =
        "₹" + Number(selectedProduct.price).toFixed(2);

    document.getElementById("productDescription").innerText =
        selectedProduct.description || "Quality kitchen equipment for your everyday cooking needs.";

    document.getElementById("productStock").innerText =
        "Available Stock: " + selectedProduct.stock;

    if (Number(selectedProduct.stock) <= 0) {

        document.getElementById("productStock").innerText =
            "Out of Stock";

        document.getElementById("addCartBtn").disabled = true;

        document.getElementById("addCartBtn").innerText =
            "Out of Stock";
    }

    document.getElementById("quantity").max =
        selectedProduct.stock;
}


// Increase Quantity
function increaseQuantity() {

    let quantityInput = document.getElementById("quantity");

    let quantity = Number(quantityInput.value);

    if (quantity < Number(selectedProduct.stock)) {
        quantityInput.value = quantity + 1;
    }
}


// Decrease Quantity
function decreaseQuantity() {

    let quantityInput = document.getElementById("quantity");

    let quantity = Number(quantityInput.value);

    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
}


// Add to Cart
function addToCart() {

    if (!selectedProduct) {
        alert("Product not found.");
        return;
    }

    let quantity = Number(document.getElementById("quantity").value);

    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (quantity > Number(selectedProduct.stock)) {
        alert("Not enough stock available.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(function(item) {
        return item.productId === selectedProduct.id;
    });

    let alreadyInCart = existingProduct ? existingProduct.quantity : 0;

    if (alreadyInCart + quantity > Number(selectedProduct.stock)) {
        alert("Available stock limit reached.");
        return;
    }

    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        cart.push({
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: Number(selectedProduct.price),
            image: selectedProduct.image,
            quantity: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product Added to Cart Successfully!");
}


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// Load Product Details
displayProductDetails();
