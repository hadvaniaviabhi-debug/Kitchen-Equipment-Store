
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


// Read Selected Category from Home Page
let selectedCategory = localStorage.getItem("selectedCategory");

if (selectedCategory) {
    document.getElementById("categoryFilter").value = selectedCategory;

    localStorage.removeItem("selectedCategory");
}


// Display Products
function displayProducts(productList) {

    let container = document.getElementById("productContainer");

    let count = document.getElementById("productCount");

    container.innerHTML = "";

    count.innerText = productList.length + " Products Found";

    if (productList.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <h3>No Products Found</h3>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    for (let i = 0; i < productList.length; i++) {

        let product = productList[i];

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
                        ₹${Number(product.price).toFixed(2)}
                    </p>

                    <p class="product-stock">
                        Available Stock: ${product.stock}
                    </p>

                    <!-- Add to Cart Button -->
                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                    <!-- View Details Button -->
                    <button
                        class="details-btn"
                        onclick="viewProductDetails(${product.id})">
                        View Details
                    </button>

                </div>

            </div>
        `;
    }
}


// Search and Filter Products
function filterProducts() {

    let searchValue = document
        .getElementById("searchInput")
        .value.toLowerCase();

    let categoryValue = document
        .getElementById("categoryFilter")
        .value;

    let sortValue = document
        .getElementById("sortFilter")
        .value;

    let filteredProducts = [];

    // Search and Category Filter
    for (let i = 0; i < products.length; i++) {

        let product = products[i];

        let productName = product.name.toLowerCase();

        let productCategory = product.category;

        if (
            productName.includes(searchValue) &&
            (categoryValue === "All" ||
            productCategory === categoryValue) &&
            Number(product.stock) > 0
        ) {
            filteredProducts.push(product);
        }
    }

    // Sort Products
    if (sortValue === "low") {

        filteredProducts.sort(function(a, b) {
            return Number(a.price) - Number(b.price);
        });

    } else if (sortValue === "high") {

        filteredProducts.sort(function(a, b) {
            return Number(b.price) - Number(a.price);
        });

    } else if (sortValue === "name") {

        filteredProducts.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    displayProducts(filteredProducts);
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


// View Product Details
function viewProductDetails(productId) {

    window.location.href =
        "product-details.html?id=" + productId;
}


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// Display All Products on Page Load
filterProducts();
