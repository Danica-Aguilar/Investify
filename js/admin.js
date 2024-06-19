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
const logoutButton = document.getElementById("logoutButton");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmationPopup = document.getElementById("confirmationPopup");

document.addEventListener("DOMContentLoaded", function () {

  onAuthStateChanged(auth, (user) => {
    const loadingScreen = document.getElementById("loading-screen");
    const dashboardContent = document.getElementById("dashboard-content");

    if (user) {
      loadingScreen.style.display = "none";
      dashboardContent.style.display = "block";

      const userId = user.uid;
      displayUserData(userId);
    } else {
      window.location.href = "login.html";
    }
  });
});



// Fetch users and display them in the table
function fetchUsers() {
    database.ref('users').on('value', (snapshot) => {
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
        database.ref('users/' + uid).update({
            email: newEmail,
            username: newUsername
        });
    }
}

// Delete user
function deleteUser(uid) {
    if (confirm("Are you sure you want to delete this user?")) {
        database.ref('users/' + uid).remove();
    }
}

// Call fetchUsers on page load
fetchUsers();



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

// Location getter
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    const ipAddress = data.ip;
    fetch(`https://ipgeolocation.io/ipgeo?apiKey=94da9689691148a2adf2c689ad9227c3&ip=${ipAddress}`)
      .then(response => response.json())
      .then(data => {
        const { country_name, city, latitude, longitude } = data;
        const userId = firebase.auth().currentUser.uid;
        firebase.database().ref(`users/${userId}/location`).set({
          country: country_name,
          city: city,
          latitude: latitude,
          longitude: longitude
        });
      });
  });
