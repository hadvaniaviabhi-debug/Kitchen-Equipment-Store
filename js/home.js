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


// Display Featured Products
function displayProducts() {

    let container = document.getElementById("productContainer");

    container.innerHTML = "";

    // Show only first 4 products
    let count = 0;

    for (let i = 0; i < products.length; i++) {

        if (count === 4) {
            break;
        }

        let product = products[i];

        if (Number(product.stock) > 0) {

            container.innerHTML += `
                <div class="product-card">

                    <img
                        src="${product.image || 'https://via.placeholder.com/300'}"
                        alt="${product.name}"
                    >

                    <div class="product-info">

                        <h3>${product.name}</h3>

                        <p class="product-category">
                            ${product.category}
                        </p>

                        <p class="product-price">
                            ₹${product.price}
                        </p>

                        <button class="add-cart-btn"
                            onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>

                    </div>

                </div>
            `;

            count++;
        }
    }

    if (count === 0) {
        container.innerHTML = "<p>No Products Available.</p>";
    }
}


// Add Product to Cart
function addToCart(productId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let selectedProduct = products.find(function(product) {
        return product.id === productId;
    });

    if (!selectedProduct || Number(selectedProduct.stock) <= 0) {
        alert("Product is not available.");
        return;
    }

    let existingProduct = cart.find(function(item) {
        return item.productId === productId;
    });

    if (existingProduct) {

        if (existingProduct.quantity >= Number(selectedProduct.stock)) {
            alert("Available stock limit reached.");
            return;
        }

        existingProduct.quantity++;

    } else {

        cart.push({
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: Number(selectedProduct.price),
            image: selectedProduct.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product Added to Cart Successfully!");
}


// Open Category
function openCategory(category) {

    localStorage.setItem("selectedCategory", category);

    window.location.href = "products-list.html";
}


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// Load Products
displayProducts();