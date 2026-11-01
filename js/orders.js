// Check Admin Login
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "admin") {
    window.location.href = "../login.html";
}

// Get Orders from LocalStorage
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Display Orders
function displayOrders(orderList) {

    let table = document.getElementById("orderTable");

    table.innerHTML = "";

    if (orderList.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No Orders Found
                </td>
            </tr>
        `;
        return;
    }

    for (let i = 0; i < orderList.length; i++) {

        let order = orderList[i];

        let orderIndex = orders.findIndex(function(item) {
            return item.id === order.id;
        });

        let orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "N/A";

        let status = order.status || "Pending";

        table.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customerName || "N/A"}</td>
                <td>${orderDate}</td>
                <td>₹${Number(order.totalAmount || 0).toFixed(2)}</td>

                <td>
                    <select class="status-select"
                        onchange="updateStatus(${orderIndex}, this.value)">

                        <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>

                        <option value="Processing" ${status === "Processing" ? "selected" : ""}>Processing</option>

                        <option value="Shipped" ${status === "Shipped" ? "selected" : ""}>Shipped</option>

                        <option value="Delivered" ${status === "Delivered" ? "selected" : ""}>Delivered</option>

                        <option value="Cancelled" ${status === "Cancelled" ? "selected" : ""}>Cancelled</option>

                    </select>
                </td>

                <td>
                    <button class="view-btn"
                        onclick="viewOrder(${orderIndex})">
                        View
                    </button>
                </td>
            </tr>
        `;
    }
}

// Update Order Status
function updateStatus(index, newStatus) {

    orders[index].status = newStatus;

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order Status Updated Successfully!");

    displayOrders(orders);
}

// Search Orders
function searchOrders() {

    let searchValue = document
        .getElementById("searchOrder")
        .value.toLowerCase();

    let filteredOrders = [];

    for (let i = 0; i < orders.length; i++) {

        let orderId = String(orders[i].id).toLowerCase();

        let customerName = (orders[i].customerName || "").toLowerCase();

        if (
            orderId.includes(searchValue) ||
            customerName.includes(searchValue)
        ) {
            filteredOrders.push(orders[i]);
        }
    }

    displayOrders(filteredOrders);
}

// View Order Details
function viewOrder(index) {

    let order = orders[index];

    let details = document.getElementById("orderDetails");

    let itemsHTML = "";

    if (order.items && order.items.length > 0) {

        for (let i = 0; i < order.items.length; i++) {

            let item = order.items[i];

            itemsHTML += `
                <div class="item-row">
                    <p><b>Product:</b> ${item.name}</p>
                    <p><b>Price:</b> ₹${Number(item.price || 0).toFixed(2)}</p>
                    <p><b>Quantity:</b> ${item.quantity}</p>
                    <p><b>Subtotal:</b> ₹${Number(item.subtotal || 0).toFixed(2)}</p>
                </div>
            `;
        }

    } else {
        itemsHTML = "<p>Product details are not available.</p>";
    }

    details.innerHTML = `
        <p><b>Order ID:</b> ${order.id}</p>
        <p><b>Customer:</b> ${order.customerName || "N/A"}</p>
        <p><b>Email:</b> ${order.customerEmail || "N/A"}</p>
        <p><b>Date:</b> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
        <p><b>Status:</b> ${order.status || "Pending"}</p>

        <h3>Products</h3>

        ${itemsHTML}

        <h3>Total Amount: ₹${Number(order.totalAmount || 0).toFixed(2)}</h3>
    `;

    document.getElementById("orderModal").style.display = "flex";
}

// Close Popup
function closeModal() {
    document.getElementById("orderModal").style.display = "none";
}

// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../login.html";
}

// Display Orders on Page Load
displayOrders(orders);