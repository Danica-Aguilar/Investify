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
    set,
    serverTimestamp
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
const logoutButton = document.getElementById("logoutButton");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmationPopup = document.getElementById("confirmationPopup");

document.addEventListener("DOMContentLoaded", function () {

    onAuthStateChanged(auth, (user) => {
        const loadingScreen = document.getElementById("loading-screen");
        const dashboardContent = document.getElementById("dashboard-content");
        const settings = document.getElementById("settings");

        if (user) {
            loadingScreen.style.display = "none";
            dashboardContent.style.display = "block";
            settings.style.display = "block";

            const userId = user.uid;
            displayUserData(userId);
        } else {
            window.location.href = "login.html";
        }
    });
});

// ============== Display user data from Realtime Db ============== //
function displayUserData(uid) {
    const dbRef = ref(database);
    get(child(dbRef, `users/${uid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const firstname = userData.firstname || " User ";

                document.getElementById("welcomeMessage").textContent = `Welcome, ${firstname}!`;
                const userDataDiv = document.querySelector(".user-info");
                userDataDiv.innerHTML = `
          <h3>👋Hello, ${firstname}!</h3>
        `;
        updateProfileName(uid);
            }
        })
        .catch((error) => {
            console.error("Error retrieving user data: ", error);
        });
}


// ====================== Retrieving username data =======================//
function updateProfileName(uid) {
    const dbRef = ref(database);
    get(child(dbRef, `users/${uid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const depositData = snapshot.val();
                const lastname = depositData.lastname || "-";
                // Select the input element and set its value
                document.querySelectorAll('#fullname').forEach(element => {
                    element.value = lastname;
                    element.disabled = true; // Disable the input element
                });
            }
        })
        .catch((error) => {
            console.error("Error retrieving data: ", error);
        });
}


// ============== Logout Fx ================ //
logoutButton.addEventListener('click', () => {
    localStorage.clear(); // Clear the storage
    confirmationPopup.classList.add("show");
});

confirmYes.addEventListener('click', () => {
    signOut(auth).then(() => {
        showPopup("Logged out successfully!");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 5000);
    }).catch((error) => {
        console.error("Error logging out:", error);
        showPopup("Error logging out: " + error.message);
    });
    confirmationPopup.classList.remove("show");
});

confirmNo.addEventListener('click', () => {
    confirmationPopup.classList.remove("show");
});

const showPopup = (message) => {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    popupMessage.textContent = message;
    popup.classList.add("show");
};

const closePopup = () => {
    const popup = document.getElementById("popup");
    popup.classList.remove("show");
};

document.querySelector(".close").addEventListener("click", closePopup);
