// Login check
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.userType !== "client") {
    window.location.href = "login.html";
}

// Customer name display
document.getElementById("customerName").innerText =
    currentUser.firstName + " " + currentUser.lastName;


// Fill customer details automatically
document.getElementById("fullName").value =
    currentUser.firstName + " " + currentUser.lastName;

document.getElementById("email").value =
    currentUser.email;


// Send contact message
document.getElementById("contactForm").addEventListener("submit", function(event) {

    event.preventDefault();

    // Get form values
    let fullName = document.getElementById("fullName").value.trim();

    let email = document.getElementById("email").value.trim();

    let subject = document.getElementById("subject").value.trim();

    let message = document.getElementById("message").value.trim();


    // Get existing messages
    let messages = JSON.parse(localStorage.getItem("messages")) || [];


    // Create message object
    let newMessage = {

        id: Date.now(),

        customerId: currentUser.id,

        fullName: fullName,

        email: email,

        subject: subject,

        message: message,

        createdAt: new Date().toISOString(),

        status: "New"
    };


    // Save message
    messages.push(newMessage);

    localStorage.setItem("messages", JSON.stringify(messages));


    alert("Your message has been sent successfully!");

    // Clear form
    document.getElementById("subject").value = "";

    document.getElementById("message").value = "";

});


// Logout
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}