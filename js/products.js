
// Check Admin Login

let user = JSON.parse(localStorage.getItem("currentUser"));

if (user == null || user.userType != "admin") {
    window.location.href = "../login.html";
}


// Get HTML Elements

let form = document.getElementById("productForm");

let productList = document.getElementById("productList");

let message = document.getElementById("message");

let search = document.getElementById("search");


// Get Products From LocalStorage

let products = JSON.parse(localStorage.getItem("products")) || [];


// Edit Product Index

let editIndex = -1;


// Save Products In LocalStorage

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}


// Display All Products

function displayProducts() {

    productList.innerHTML = "";

    let found = false;

    for (let i = 0; i < products.length; i++) {

        let p = products[i];

        // Search Product

        if (p.name.toLowerCase().includes(search.value.toLowerCase())) {

            found = true;

            productList.innerHTML += `
                <div class="product-card">

                    <img src="${p.image}" alt="Product"
                    onerror="this.onerror=null;this.src='https://placehold.co/400x250?text=No+Image'">

                    <div class="product-info">

                        <h3>${p.name}</h3>

                        <p>Category: ${p.category}</p>

                        <p>Price: ₹${p.price}</p>

                        <p>Stock: ${p.stock}</p>

                        <button class="edit-btn" onclick="editProduct(${i})">
                            Edit
                        </button>

                        <button class="delete-btn" onclick="deleteProduct(${i})">
                            Delete
                        </button>

                    </div>

                </div>
            `;
        }
    }

    if (found == false) {
        productList.innerHTML = "<p>No Products Found!</p>";
    }
}


// Add Or Update Product

form.addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("productName").value.trim();

    let category = document.getElementById("category").value;

    let price = Number(document.getElementById("price").value);

    let stock = Number(document.getElementById("stock").value);

    let image = document.getElementById("image").value.trim();


    // Check Values

    if (name == "" || category == "" || price <= 0 || stock < 0 || image == "") {

        message.innerText = "Please enter valid product details!";

        message.style.color = "red";

        return;
    }


    // Create Product Object

    let product = {

        id: editIndex == -1 ? Date.now() : products[editIndex].id,

        name: name,

        category: category,

        price: price,

        stock: stock,

        image: image

    };


    // Add Or Update

    if (editIndex == -1) {

        products.push(product);

        message.innerText = "Product Added Successfully!";

    } else {

        products[editIndex] = product;

        message.innerText = "Product Updated Successfully!";

    }


    message.style.color = "green";


    // Save Data

    saveProducts();


    // Reset Form

    form.reset();

    editIndex = -1;

    document.getElementById("formTitle").innerText = "Add New Product";

    document.getElementById("submitBtn").innerText = "Add Product";

    document.getElementById("cancelBtn").style.display = "none";


    // Display Products

    displayProducts();

});


// Edit Product

function editProduct(index) {

    editIndex = index;

    let p = products[index];

    document.getElementById("productName").value = p.name;

    document.getElementById("category").value = p.category;

    document.getElementById("price").value = p.price;

    document.getElementById("stock").value = p.stock;

    document.getElementById("image").value = p.image;


    document.getElementById("formTitle").innerText = "Edit Product";

    document.getElementById("submitBtn").innerText = "Update Product";

    document.getElementById("cancelBtn").style.display = "inline-block";

    message.innerText = "";

    window.scrollTo(0, 0);

}


// Delete Product

function deleteProduct(index) {

    let confirmDelete = confirm("Are you sure you want to delete this product?");

    if (confirmDelete == true) {

        products.splice(index, 1);

        saveProducts();

        displayProducts();

        message.innerText = "Product Deleted Successfully!";

        message.style.color = "green";
    }

}


// Cancel Edit

document.getElementById("cancelBtn").addEventListener("click", function() {

    form.reset();

    editIndex = -1;

    document.getElementById("formTitle").innerText = "Add New Product";

    document.getElementById("submitBtn").innerText = "Add Product";

    document.getElementById("cancelBtn").style.display = "none";

    message.innerText = "";

});


// Search Product

search.addEventListener("input", function() {

    displayProducts();

});


// Display Products When Page Opens

displayProducts();
