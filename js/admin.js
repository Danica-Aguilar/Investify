import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    get,
    child,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDosNrhPrcRC2UpOu9Wu3N2p3jaUwbJyDI",
    authDomain: "login-example-c7c78.firebaseapp.com",
    projectId: "login-example-c7c78",
    storageBucket: "login-example-c7c78.appspot.com",
    messagingSenderId: "298272317823",
    appId: "1:298272317823:web:07b88844cd084699197a4a",
    databaseURL: "https://login-example-c7c78-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM elements
const logoutButton = document.getElementById("logoutButton");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmationPopup = document.getElementById("confirmationPopup");
const loadingScreen = document.getElementById("loading-screen");
const dashboardContent = document.getElementById("dashboard-content");

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            showLoadingScreen();
            checkUserRole(user.uid);
        } else {
            redirectToLogin();
        }
    });
});

// Show loading screen and hide dashboard content
function showLoadingScreen() {
    loadingScreen.style.display = "block";
    dashboardContent.style.display = "none";
}

// Hide loading screen and show dashboard content
function hideLoadingScreen() {
    loadingScreen.style.display = "none";
    dashboardContent.style.display = "block";
}

// Redirect to login page
function redirectToLogin() {
    window.location.href = "login.html";
}

// Check user's role
function checkUserRole(uid) {
    const dbRef = ref(database);
    get(child(dbRef, `users/${uid}/role`))
        .then((snapshot) => {
            if (snapshot.exists() && snapshot.val().includes("admin")) {
                hideLoadingScreen();
                fetchUsers(); // Fetch and display users
            } else {
                console.warn("User is not an admin. Redirecting to login.");
                redirectToLogin();
            }
        })
        .catch((error) => {
            console.error("Error retrieving user role:", error);
            redirectToLogin();
        });
}

// Fetch and display users
function fetchUsers() {
    const usersList = document.getElementById("users-list");
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
        usersList.innerHTML = ""; // Clear the list before adding new users
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${childSnapshot.key}</td>
                <td>${user.email}</td>
                <td>${user.username}</td>
                <td>
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
                </td>
            `;
            usersList.appendChild(row);
        });
    });
}

// Handle logout
logoutButton.addEventListener("click", () => {
    confirmationPopup.style.display = "block";
});

confirmYes.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            confirmationPopup.style.display = "none";
            redirectToLogin();
        })
        .catch((error) => {
            console.error("Sign out error:", error);
        });
});

confirmNo.addEventListener("click", () => {
    confirmationPopup.style.display = "none";
});
