document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            const storedUser = localStorage.getItem(email);
            if (!storedUser) {
                alert("User not found. Please sign up first.");
                return;
            }

            const userData = JSON.parse(storedUser);
            if (userData.password === password) {
                alert("Login successful!");
                window.location.href = "dashboard.html"; // Redirect to a new page
            } else {
                alert("Incorrect password. Try again.");
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const name = document.getElementById("signupName").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;

            if (localStorage.getItem(email)) {
                alert("User already exists. Please log in.");
                return;
            }

            const userData = { name, email, password };
            localStorage.setItem(email, JSON.stringify(userData));

            alert("Signup successful! You can now log in.");
            window.location.href = "index.html"; // Redirect to login page
        });
    }
});
