// Login check
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "client") {
    window.location.href = "login.html";
}

// Customer name display
document.getElementById("customerName").innerText =
    currentUser.firstName + " " + currentUser.lastName;


// Display customer orders
function displayOrders() {

    let allOrders = JSON.parse(localStorage.getItem("orders")) || [];

    let ordersContainer = document.getElementById("ordersContainer");

    // Show only logged-in customer's orders
    let customerOrders = [];

    for (let i = 0; i < allOrders.length; i++) {

        if (allOrders[i].customerId == currentUser.id) {
            customerOrders.push(allOrders[i]);
        }
    }

    // Show latest orders first
    customerOrders.reverse();

    document.getElementById("totalOrders").innerText =
        customerOrders.length + " Orders";

    ordersContainer.innerHTML = "";

    // Check empty orders
    if (customerOrders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <h3>No Orders Found!</h3>
                <p>You have not placed any orders yet.</p>
                <a href="products-list.html">Start Shopping</a>
            </div>
        `;

        return;
    }

    // Display order cards
    for (let i = 0; i < customerOrders.length; i++) {

        let order = customerOrders[i];

        let orderDate = new Date(order.createdAt).toLocaleDateString();

        let statusClass = order.status.toLowerCase();

        ordersContainer.innerHTML += `
            <div class="order-card">

                <div class="order-top">

                    <div>
                        <p class="order-number">${order.id}</p>
                        <p class="order-date">Order Date: ${orderDate}</p>
                    </div>

                    <span class="order-status status-${statusClass}">
                        ${order.status}
                    </span>

                </div>

                <div class="order-bottom">

                    <p class="order-total">
                        Total: ₹${order.totalAmount}
                    </p>

                    <button class="details-btn"
                        onclick="viewOrderDetails('${order.id}')">
                        View Details
                    </button>

                </div>

            </div>
        `;
    }
}


// View order details
function viewOrderDetails(orderId) {

    let allOrders = JSON.parse(localStorage.getItem("orders")) || [];

    let selectedOrder = null;

    // Find selected customer's order
    for (let i = 0; i < allOrders.length; i++) {

        if (
            allOrders[i].id == orderId &&
            allOrders[i].customerId == currentUser.id
        ) {
            selectedOrder = allOrders[i];
            break;
        }
    }

    if (selectedOrder === null) {
        alert("Order not found.");
        return;
    }

    let orderDetails = document.getElementById("orderDetails");

    let orderDate = new Date(selectedOrder.createdAt).toLocaleString();

    let html = `
        <div class="detail-row">
            <strong>Order ID:</strong>
            <span>${selectedOrder.id}</span>
        </div>

        <div class="detail-row">
            <strong>Order Date:</strong>
            <span>${orderDate}</span>
        </div>

        <div class="detail-row">
            <strong>Customer:</strong>
            <span>${selectedOrder.customerName}</span>
        </div>

        <div class="detail-row">
            <strong>Email:</strong>
            <span>${selectedOrder.customerEmail}</span>
        </div>

        <div class="detail-row">
            <strong>Phone:</strong>
            <span>${selectedOrder.phone || "Not available"}</span>
        </div>

        <div class="detail-row">
            <strong>Address:</strong>
            <span>${selectedOrder.address || "Not available"}</span>
        </div>

        <div class="detail-row">
            <strong>Payment:</strong>
            <span>${selectedOrder.paymentMethod || "Not available"}</span>
        </div>

        <div class="detail-row">
            <strong>Status:</strong>
            <span>${selectedOrder.status}</span>
        </div>

        <div class="detail-items">
            <h3>Ordered Products</h3>
    `;

    // Display ordered products
    for (let i = 0; i < selectedOrder.items.length; i++) {

        let item = selectedOrder.items[i];

        html += `
            <div class="detail-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <strong>₹${item.subtotal}</strong>
            </div>
        `;
    }

    html += `
            <hr>

            <div class="detail-row">
                <strong>Total Amount:</strong>
                <strong>₹${selectedOrder.totalAmount}</strong>
            </div>

        </div>
    `;

    orderDetails.innerHTML = html;

    document.getElementById("orderModal").style.display = "flex";
}


// Close modal
function closeModal() {

    document.getElementById("orderModal").style.display = "none";
}


// Close modal when clicking outside
window.onclick = function(event) {

    let modal = document.getElementById("orderModal");

    if (event.target === modal) {
        closeModal();
    }
};


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// Display orders when page loads
displayOrders();