// Get Elements

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const message = document.getElementById("message");

const loginBtn = document.getElementById("loginBtn");

const togglePassword = document.getElementById("togglePassword");


// Show / Hide Password

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerText = "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.innerText = "Show";

    }

});


// Password Hash Function

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const passwordData = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        passwordData
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

}


// Display Message

function showMessage(text, color) {

    message.innerText = text;

    message.style.color = color;

}


// Login Form Submit

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();

    const password = passwordInput.value;

    // Empty Validation

    if (!email || !password) {

        showMessage("Please enter email and password!", "red");

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerText = "Logging in...";

    try {

        // Get Users From LocalStorage

        const users = JSON.parse(
            localStorage.getItem("users")
        ) || [];

        // Find Registered User

        const user = users.find(function (u) {

            return u.email === email;

        });

        if (!user) {

            showMessage("Invalid email or password!", "red");

            return;

        }

        // Hash Entered Password

        const enteredPasswordHash = await hashPassword(password);

        // Compare Password Hash

        if (enteredPasswordHash !== user.passwordHash) {

            showMessage("Invalid email or password!", "red");

            return;

        }

        // Create Current User Session
        // Do not store password or passwordHash in session

        const currentUser = {

            id: user.id,

            firstName: user.firstName,

            lastName: user.lastName,

            email: user.email,

            userType: user.userType

        };

        // Save Login Session

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        showMessage("Login Successful!", "green");

        // Redirect Based On User Type

        setTimeout(function () {

            if (user.userType === "admin") {

                window.location.href = "admin/dashboard.html";

            } else if (user.userType === "client") {

                window.location.href = "home.html";

            } else {

                showMessage("Invalid user role!", "red");

            }

        }, 1000);

    } catch (error) {

        console.error("Login Error:", error);

        showMessage(
            "Something went wrong. Please try again.",
            "red"
        );

    } finally {

        loginBtn.disabled = false;

        loginBtn.innerText = "Login";

    }

});