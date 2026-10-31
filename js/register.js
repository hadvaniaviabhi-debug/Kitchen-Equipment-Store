
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    // Get Form Values

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const userType = document.getElementById("userType").value;

    const message = document.getElementById("message");

    // Check Empty Fields

    if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
        message.style.color = "red";
        message.innerText = "Please fill all fields!";
        return;
    }

    // Check Password Length

    if (password.length < 6) {
        message.style.color = "red";
        message.innerText = "Password must be at least 6 characters!";
        return;
    }

    // Check Password Match

    if (password !== confirmPassword) {
        message.style.color = "red";
        message.innerText = "Password and Confirm Password do not match!";
        return;
    }

    // Get Existing Users from LocalStorage

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check Duplicate Email

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        message.style.color = "red";
        message.innerText = "Email already registered!";
        return;
    }

    try {

        // Hash Password

        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("Secure password hashing is not available.");
        }

        const encoder = new TextEncoder();

        const passwordData = encoder.encode(password);

        const hashBuffer = await crypto.subtle.digest("SHA-256", passwordData);

        const hashArray = Array.from(new Uint8Array(hashBuffer));

        const passwordHash = hashArray
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

        // Create New User Object

        const newUser = {

            id: Date.now(),

            firstName: firstName,

            lastName: lastName,

            email: email,

            passwordHash: passwordHash,

            userType: userType,

            createdAt: new Date().toISOString()

        };

        // Store User in LocalStorage

        users.push(newUser);

        localStorage.setItem("users", JSON.stringify(users));

        // Success Message

        message.style.color = "green";

        message.innerText = "Registration Successful!";

        // Reset Form

        registerForm.reset();

        // Redirect to Login Page

        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);

    } catch (error) {

        message.style.color = "red";

        message.innerText = "Registration failed. Please try again.";

        console.error(error);

    }

});
