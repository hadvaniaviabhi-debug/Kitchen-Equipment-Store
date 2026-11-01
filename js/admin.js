
// Check Admin Login

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (!currentUser || currentUser.userType !== "admin") {

    window.location.href = "../login.html";

}


// Display Admin Name

document.getElementById("adminName").innerText =
    currentUser.firstName + " " + currentUser.lastName;


// Get LocalStorage Data

const products = JSON.parse(
    localStorage.getItem("products")
) || [];

const users = JSON.parse(
    localStorage.getItem("users")
) || [];

const orders = JSON.parse(
    localStorage.getItem("orders")
) || [];


// Total Products

document.getElementById("totalProducts").innerText =
    products.length;


// Total Customers

const customers = users.filter(user =>
    user.userType === "client"
);

document.getElementById("totalCustomers").innerText =
    customers.length;


// Total Orders

document.getElementById("totalOrders").innerText =
    orders.length;


// Calculate Total Revenue

const totalRevenue = orders.reduce(function(total, order) {

    if (order.status !== "Cancelled") {
        return total + Number(order.totalAmount || 0);
    }

    return total;

}, 0);

document.getElementById("totalRevenue").innerText =
    "₹" + totalRevenue.toLocaleString("en-IN");


// Display Recent Orders

const ordersTable = document.getElementById("ordersTable");

const emptyMessage = document.getElementById("emptyMessage");

const recentOrders = [...orders].reverse().slice(0, 5);

if (recentOrders.length === 0) {

    emptyMessage.innerText = "No Orders Available.";

} else {

    emptyMessage.innerText = "";

    recentOrders.forEach(function(order) {

        const row = document.createElement("tr");

        const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-IN")
            : "N/A";

        const customerName = order.customerName || "Unknown";

        const amount = Number(order.totalAmount || 0);

        const status = order.status || "Pending";

        const cells = [
            order.id || "N/A",
            customerName,
            orderDate,
            "₹" + amount.toLocaleString("en-IN")
        ];

        cells.forEach(function(value) {

            const td = document.createElement("td");

            td.textContent = value;

            row.appendChild(td);

        });

        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");

        statusBadge.className = "status";

        statusBadge.textContent = status;

        statusCell.appendChild(statusBadge);

        row.appendChild(statusCell);

        ordersTable.appendChild(row);

    });

}


// Logout

document.getElementById("logoutBtn").addEventListener("click", function() {

    localStorage.removeItem("currentUser");

    window.location.href = "../login.html";

});
