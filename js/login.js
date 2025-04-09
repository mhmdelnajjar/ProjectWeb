let users = [];

const loginBtn = document.querySelector("#loginForm");
loginBtn.addEventListener("submit", handleLogin);

// Fetch users from JSON file and initialize localStorage
async function initializeUsers() {
    const storedUsers = localStorage.getItem('users');
    
    // If users don't exist in localStorage, fetch from JSON
    if (!storedUsers) {
        try {
            const response = await fetch('jsons/users.json');
            const data = await response.json();

            const response2 = await fetch("jsons/courses.json");
            const data2 = await response2.json();
            localStorage.courses = JSON.stringify(data2.courses);
            
            // Store the usersArray in localStorage
            localStorage.setItem('users', JSON.stringify(data.usersArray));
            users = data.usersArray;
        } catch (error) {
            console.error("Error loading users:", error);
            users = []; // Fallback to empty array
        }
    } else {
        users = JSON.parse(storedUsers);
    }
}

// Call this when the page loads
initializeUsers();

function handleLogin(e) {
    e.preventDefault();
    
    // Clear any previous error messages
    const errorElement = document.querySelector("#loginError");
    if (errorElement) {
        errorElement.remove();
    }
    
    // Get users from localStorage
    const storedUsers = localStorage.getItem('users');
    users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const usernameLogged = document.querySelector("#username").value.trim();
    const passwordLogged = document.querySelector("#password").value.trim();
    
    validateUsers(usernameLogged, passwordLogged, users);
}

function validateUsers(usernameLogged, passwordLogged, users) {
    const isFound = users.find(user => {
        return user.username === usernameLogged && user.password === passwordLogged;
    });
    
    if(isFound) {
        localStorage.setItem('currentUser', JSON.stringify(isFound));
        
        if (isFound.userType == "admin") {
            window.location.href = `admin.html`;
        } else if (isFound.userType == "student") {
            window.location.href = `main.html`;
        } else if (isFound.userType == "instructor") {
            window.location.href = `inst.html`;
        } else {
            showLoginError("User type not recognized!");
        }
    } else {
        showLoginError("Invalid username or password. Please try again.");
    }
}

function showLoginError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector("#loginError");
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement("div");
    errorElement.id = "loginError";
    errorElement.style.color = "red";
    errorElement.style.marginTop = "5px";
    errorElement.style.fontSize = "14px";
    errorElement.textContent = message;
    
    // Insert after password field
    const passwordField = document.querySelector("#password");
    passwordField.insertAdjacentElement("afterend", errorElement);
    
    // Focus back on password field
    passwordField.focus();
}