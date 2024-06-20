// Initialize Firebase (make sure this is done before using Firebase)
// Replace the config object with your Firebase project's config
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
            if (snapshot.exists() && snapshot.val() === "admin") {
                hideLoadingScreen();
                fetchUsers(); // Fetch and display users
            } else {
                redirectToLogin();
            }
        })
        .catch((error) => {
            console.error("Error retrieving user role: ", error);
            redirectToLogin(); // Redirect to login page on error
        });
}

// Fetch and display users data from Realtime Database
function fetchUsers() {
    const dbRef = ref(database, 'users');
    dbRef.on('value', (snapshot) => {
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = '';

        snapshot.forEach((userSnapshot) => {
            const user = userSnapshot.val();
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.uid}</td>
                <td>${user.email}</td>
                <td>${user.username}</td>
                <td>
                    <button onclick="editUser('${user.uid}')">Edit</button>
                    <button onclick="deleteUser('${user.uid}')">Delete</button>
                </td>
            `;
            usersList.appendChild(userRow);
        });
    });
}

// Edit user details
function editUser(uid) {
    const newEmail = prompt("Enter new email:");
    const newUsername = prompt("Enter new username:");

    if (newEmail && newUsername) {
        const userRef = ref(database, 'users/' + uid);
        userRef.update({
            email: newEmail,
            username: newUsername
        });
    }
}

// Delete user
function deleteUser(uid) {
    if (confirm("Are you sure you want to delete this user?")) {
        const userRef = ref(database, 'users/' + uid);
        userRef.remove();
    }
}

function displayUserData(uid) {
    const dbRef = ref(database);
    get(child(dbRef, `users/${uid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const firstname = userData.firstname || " User ";

                const userDataDiv = document.querySelector(".user-info");
                userDataDiv.innerHTML = `
            <h3>👋Hello, ${firstname}!</h3>
          `;
            }
        })
        .catch((error) => {
            console.error("Error retrieving user data: ", error);
        });
}

// Logout functionality
logoutButton.addEventListener('click', () => {
    confirmationPopup.classList.add("show");
});

confirmYes.addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.clear(); // Clear the storage
        showPopup("Logged out successfully!");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    }).catch((error) => {
        console.error("Error logging out:", error);
        showPopup("Error logging out: " + error.message);
    });
    confirmationPopup.classList.remove("show");
});

confirmNo.addEventListener('click', () => {
    confirmationPopup.classList.remove("show");
});

// Show popup
const showPopup = (message) => {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    popupMessage.textContent = message;
    popup.classList.add("show");
};

// Close popup
const closePopup = () => {
    const popup = document.getElementById("popup");
    popup.classList.remove("show");
};

document.querySelector(".close").addEventListener("click", closePopup);