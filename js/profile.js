// Login check
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "client") {
    window.location.href = "login.html";
}

// Customer name display
document.getElementById("customerName").innerText =
    currentUser.firstName + " " + currentUser.lastName;


// Display profile details
function displayProfile() {

    document.getElementById("profileName").innerText =
        currentUser.firstName + " " + currentUser.lastName;

    document.getElementById("profileEmail").innerText =
        currentUser.email;

    document.getElementById("firstName").value =
        currentUser.firstName;

    document.getElementById("lastName").value =
        currentUser.lastName;

    document.getElementById("email").value =
        currentUser.email;
}


// Update profile
document.getElementById("profileForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    let firstName = document.getElementById("firstName").value.trim();

    let lastName = document.getElementById("lastName").value.trim();

    let email = document.getElementById("email").value.trim().toLowerCase();

    let password = document.getElementById("password").value;

    let confirmPassword = document.getElementById("confirmPassword").value;


    // Get all users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find current customer
    let userIndex = -1;

    for (let i = 0; i < users.length; i++) {

        if (users[i].id == currentUser.id) {
            userIndex = i;
            break;
        }
    }

    if (userIndex === -1) {
        alert("User account not found. Please login again.");
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
        return;
    }


    // Check duplicate email
    for (let i = 0; i < users.length; i++) {

        if (users[i].email.toLowerCase() === email &&
            users[i].id != currentUser.id) {

            alert("This email is already registered.");
            return;
        }
    }


    // Password validation
    if (password !== "" || confirmPassword !== "") {

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Hash new password using SHA-256
        let passwordData = new TextEncoder().encode(password);

        let hashBuffer = await crypto.subtle.digest("SHA-256", passwordData);

        let hashArray = Array.from(new Uint8Array(hashBuffer));

        let passwordHash = hashArray.map(function(byte) {
            return byte.toString(16).padStart(2, "0");
        }).join("");

        users[userIndex].passwordHash = passwordHash;
    }


    // Update user details
    users[userIndex].firstName = firstName;
    users[userIndex].lastName = lastName;
    users[userIndex].email = email;


    // Save updated users
    localStorage.setItem("users", JSON.stringify(users));


    // Update current login details
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.email = email;

    localStorage.setItem("currentUser", JSON.stringify(currentUser));


    // Update customer name in navbar
    document.getElementById("customerName").innerText =
        firstName + " " + lastName;

    // Update profile heading
    document.getElementById("profileName").innerText =
        firstName + " " + lastName;

    document.getElementById("profileEmail").innerText = email;


    // Clear password fields
    document.getElementById("password").value = "";

    document.getElementById("confirmPassword").value = "";

    alert("Profile updated successfully!");

});


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}


// Display profile on page load
displayProfile();