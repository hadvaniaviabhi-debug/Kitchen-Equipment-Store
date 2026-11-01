
// Check Admin Login

let user = JSON.parse(localStorage.getItem("currentUser"));

if (user == null || user.userType != "admin") {
    window.location.href = "../login.html";
}


// Get HTML Elements

let customerTable = document.getElementById("customerTable");

let search = document.getElementById("search");

let totalCustomers = document.getElementById("totalCustomers");

let emptyMessage = document.getElementById("emptyMessage");


// Get Users From LocalStorage

let users = JSON.parse(localStorage.getItem("users")) || [];


// Show Customers

function displayCustomers() {

    customerTable.innerHTML = "";

    let count = 0;

    let found = false;

    for (let i = 0; i < users.length; i++) {

        let u = users[i];

        // Only Client Customers

        if (u.userType == "client") {

            let name = u.firstName + " " + u.lastName;

            // Search Customer

            if (
                name.toLowerCase().includes(search.value.toLowerCase()) ||
                u.email.toLowerCase().includes(search.value.toLowerCase())
            ) {

                found = true;

                count++;

                let date = new Date(u.createdAt).toLocaleDateString("en-IN");

                let row = document.createElement("tr");

                row.innerHTML = `
                    <td>${count}</td>
                    <td>${name}</td>
                    <td>${u.email}</td>
                    <td>${date}</td>

                    <td>
                        <button class="action-btn view-btn"
                            onclick="viewCustomer(${i})">
                            View
                        </button>

                        <button class="action-btn delete-btn"
                            onclick="deleteCustomer(${i})">
                            Delete
                        </button>
                    </td>
                `;

                customerTable.appendChild(row);

            }

        }

    }

    // Show Total Customers

    totalCustomers.innerText = users.filter(
        u => u.userType == "client"
    ).length;

    // No Customer Message

    if (found == false) {
        emptyMessage.innerText = "No Customers Found!";
    } else {
        emptyMessage.innerText = "";
    }

}


// View Customer Details

function viewCustomer(index) {

    let u = users[index];

    let name = u.firstName + " " + u.lastName;

    let date = new Date(u.createdAt).toLocaleDateString("en-IN");

    document.getElementById("customerDetails").innerHTML = `
        <b>Name:</b> ${name}<br>
        <b>Email:</b> ${u.email}<br>
        <b>User Type:</b> ${u.userType}<br>
        <b>Registration Date:</b> ${date}
    `;

    document.getElementById("customerModal").style.display = "flex";

}


// Close Popup

document.getElementById("closeModal").addEventListener("click", function() {

    document.getElementById("customerModal").style.display = "none";

});


// Delete Customer

function deleteCustomer(index) {

    let confirmDelete = confirm("Are you sure you want to delete this customer?");

    if (confirmDelete == true) {

        users.splice(index, 1);

        localStorage.setItem("users", JSON.stringify(users));

        displayCustomers();

        alert("Customer Deleted Successfully!");

    }

}


// Search Customer

search.addEventListener("input", function() {

    displayCustomers();

});


// Display Customers

displayCustomers();
