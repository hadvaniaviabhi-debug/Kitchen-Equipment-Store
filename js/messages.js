
/* Admin Login Check */
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "admin") {
    window.location.href = "../login.html";
}

/* Get Messages */
let messages = JSON.parse(localStorage.getItem("messages")) || [];

/* Display Messages */
function displayMessages() {

    messages = JSON.parse(localStorage.getItem("messages")) || [];

    let table = document.getElementById("messageTable");
    let search = document.getElementById("searchInput").value.toLowerCase();

    table.innerHTML = "";

    let filteredMessages = [];

    for (let i = 0; i < messages.length; i++) {

        let name = messages[i].fullName || "";
        let email = messages[i].email || "";
        let subject = messages[i].subject || "";

        if (
            name.toLowerCase().includes(search) ||
            email.toLowerCase().includes(search) ||
            subject.toLowerCase().includes(search)
        ) {
            filteredMessages.push(messages[i]);
        }
    }

    if (filteredMessages.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No messages found
                </td>
            </tr>
        `;
    }

    for (let i = 0; i < filteredMessages.length; i++) {

        let message = filteredMessages[i];

        let status = message.status || "New";

        let statusClass = status.toLowerCase();

        let date = message.createdAt
            ? new Date(message.createdAt).toLocaleDateString()
            : "-";

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${escapeHTML(message.fullName)}</td>
            <td>${escapeHTML(message.email)}</td>
            <td>${escapeHTML(message.subject)}</td>
            <td>${date}</td>
            <td>
                <select onchange="updateStatus(${message.id}, this.value)">
                    <option value="New" ${status === "New" ? "selected" : ""}>New</option>
                    <option value="Read" ${status === "Read" ? "selected" : ""}>Read</option>
                    <option value="Replied" ${status === "Replied" ? "selected" : ""}>Replied</option>
                </select>
            </td>
            <td>
                <button class="action-btn view-btn"
                    onclick="viewMessage(${message.id})">
                    View
                </button>

                <button class="action-btn delete-btn"
                    onclick="deleteMessage(${message.id})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    }

    updateStatistics();
}

/* Safe Text Display */
function escapeHTML(value) {

    let div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;
}

/* Update Statistics */
function updateStatistics() {

    let total = messages.length;
    let newCount = 0;
    let readCount = 0;

    for (let i = 0; i < messages.length; i++) {

        let status = messages[i].status || "New";

        if (status === "New") {
            newCount++;
        }

        if (status === "Read") {
            readCount++;
        }
    }

    document.getElementById("totalMessages").innerText = total;
    document.getElementById("newMessages").innerText = newCount;
    document.getElementById("readMessages").innerText = readCount;
}

/* View Message */
function viewMessage(id) {

    let message = messages.find(function(item) {
        return item.id == id;
    });

    if (!message) {
        return;
    }

    document.getElementById("detailName").innerText = message.fullName || "";
    document.getElementById("detailEmail").innerText = message.email || "";
    document.getElementById("detailSubject").innerText = message.subject || "";
    document.getElementById("detailDate").innerText =
        message.createdAt
            ? new Date(message.createdAt).toLocaleString()
            : "-";

    document.getElementById("detailMessage").innerText = message.message || "";

    document.getElementById("messageModal").style.display = "flex";

    if (!message.status || message.status === "New") {
        updateStatus(id, "Read");
    }
}

/* Close Modal */
function closeModal() {

    document.getElementById("messageModal").style.display = "none";
}

/* Update Message Status */
function updateStatus(id, newStatus) {

    for (let i = 0; i < messages.length; i++) {

        if (messages[i].id == id) {
            messages[i].status = newStatus;
        }
    }

    localStorage.setItem("messages", JSON.stringify(messages));

    displayMessages();
}

/* Delete Message */
function deleteMessage(id) {

    let confirmDelete = confirm("Are you sure you want to delete this message?");

    if (confirmDelete) {

        messages = messages.filter(function(message) {
            return message.id != id;
        });

        localStorage.setItem("messages", JSON.stringify(messages));

        displayMessages();

        alert("Message deleted successfully!");
    }
}

/* Admin Logout */
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../login.html";
}

/* First Time Display */
displayMessages();
