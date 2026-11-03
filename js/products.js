
// Admin Login Check
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "admin") {
    window.location.href = "../login.html";
}

// Get Products from Local Storage
let products = JSON.parse(localStorage.getItem("products")) || [];

let editingId = null;

// Get HTML Elements
let productForm = document.getElementById("productForm");

let productName = document.getElementById("productName");
let category = document.getElementById("category");
let description = document.getElementById("description");
let price = document.getElementById("price");
let stock = document.getElementById("stock");
let image = document.getElementById("image");

let submitBtn = document.getElementById("submitBtn");
let cancelBtn = document.getElementById("cancelBtn");
let formTitle = document.getElementById("formTitle");
let message = document.getElementById("message");

let productList = document.getElementById("productList");
let search = document.getElementById("search");


// Save Products
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}


// Add and Update Product
productForm.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = productName.value.trim();
    let selectedCategory = category.value;
    let productDescription = description.value.trim();
    let productPrice = Number(price.value);
    let productStock = Number(stock.value);
    let productImage = image.value.trim();

    // Validation
    if (
        name === "" ||
        selectedCategory === "" ||
        productDescription === "" ||
        productImage === "" ||
        !Number.isFinite(productPrice) ||
        productPrice <= 0 ||
        !Number.isInteger(productStock) ||
        productStock < 0
    ) {
        message.innerText = "Please enter valid product details.";
        message.style.color = "red";
        return;
    }

    // Check Image URL
    try {

        let imageURL = new URL(productImage);

        if (
            imageURL.protocol !== "https:" &&
            imageURL.protocol !== "http:"
        ) {
            message.innerText = "Please enter a valid image URL.";
            message.style.color = "red";
            return;
        }

    } catch (error) {

        message.innerText = "Please enter a valid image URL.";
        message.style.color = "red";
        return;
    }


    if (editingId === null) {

        // Add New Product
        let newProduct = {
            id: Date.now(),
            name: name,
            category: selectedCategory,
            description: productDescription,
            price: productPrice,
            stock: productStock,
            image: productImage
        };

        products.push(newProduct);

        message.innerText = "Product added successfully!";
        message.style.color = "green";

    } else {

        // Update Existing Product
        for (let i = 0; i < products.length; i++) {

            if (products[i].id === editingId) {

                products[i].name = name;
                products[i].category = selectedCategory;
                products[i].description = productDescription;
                products[i].price = productPrice;
                products[i].stock = productStock;
                products[i].image = productImage;
            }
        }

        message.innerText = "Product updated successfully!";
        message.style.color = "green";
    }

    // Save and Display
    saveProducts();

    displayProducts();

    resetForm();

});


// Display Products
function displayProducts() {

    products = JSON.parse(localStorage.getItem("products")) || [];

    let searchValue = search.value.toLowerCase();

    productList.innerHTML = "";

    let filteredProducts = products.filter(function(product) {

        return (
            (product.name || "").toLowerCase().includes(searchValue) ||
            (product.category || "").toLowerCase().includes(searchValue)
        );

    });


    if (filteredProducts.length === 0) {

        productList.innerHTML = "<p>No products found.</p>";

        return;
    }


    for (let i = 0; i < filteredProducts.length; i++) {

        let product = filteredProducts[i];

        let card = document.createElement("div");

        card.className = "product-card";

        // Product Image
        let productImage = "";

        try {

            let imageURL = new URL(product.image);

            if (
                imageURL.protocol === "http:" ||
                imageURL.protocol === "https:"
            ) {
                productImage = imageURL.href;
            }

        } catch (error) {
            productImage = "";
        }

        card.innerHTML = `

            <img
                src="${escapeHTML(productImage)}"
                alt="${escapeHTML(product.name)}"
                onerror="this.style.display='none'"
            >

            <h3>${escapeHTML(product.name)}</h3>

            <p>
                <strong>Category:</strong>
                ${escapeHTML(product.category)}
            </p>

            <p>
                <strong>Description:</strong>
                ${escapeHTML(product.description || "No description available.")}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${Number(product.price).toLocaleString("en-IN")}
            </p>

            <p>
                <strong>Stock:</strong>
                ${Number(product.stock)}
            </p>

            <button
                class="edit-btn"
                onclick="editProduct(${Number(product.id)})">
                Edit
            </button>

            <button
                class="delete-btn"
                onclick="deleteProduct(${Number(product.id)})">
                Delete
            </button>

        `;

        productList.appendChild(card);
    }

}


// Safe HTML Text
function escapeHTML(value) {

    let div = document.createElement("div");

    div.textContent = value == null ? "" : String(value);

    return div.innerHTML;
}


// Edit Product
function editProduct(id) {

    let product = products.find(function(item) {

        return item.id === id;

    });

    if (!product) {
        return;
    }

    // Fill Form
    productName.value = product.name;
    category.value = product.category;
    description.value = product.description || "";
    price.value = product.price;
    stock.value = product.stock;
    image.value = product.image;

    editingId = id;

    formTitle.innerText = "Edit Product";
    submitBtn.innerText = "Update Product";

    cancelBtn.style.display = "inline-block";

    message.innerText = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete Product
function deleteProduct(id) {

    let confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {

        products = products.filter(function(product) {

            return product.id !== id;

        });

        saveProducts();

        displayProducts();

        if (editingId === id) {
            resetForm();
        }

        alert("Product deleted successfully!");

    }

}


// Reset Form
function resetForm() {

    productForm.reset();

    editingId = null;

    formTitle.innerText = "Add New Product";

    submitBtn.innerText = "Add Product";

    cancelBtn.style.display = "none";

}


// Cancel Edit
cancelBtn.addEventListener("click", function() {

    resetForm();

    message.innerText = "";

});


// Search Products
search.addEventListener("input", function() {

    displayProducts();

});


// First Time Display
displayProducts();
