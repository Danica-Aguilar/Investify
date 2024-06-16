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
  document.getElementById("re-fund-amount").textContent = "-"; // Display "-" until data is loaded
  const numberElement = document.querySelectorAll('#number-element');

  onAuthStateChanged(auth, (user) => {
    const loadingScreen = document.getElementById("loading-screen");
    const dashboardContent = document.getElementById("dashboard-content");
    const fundWallet = document.getElementById("fund");

    if (user) {
      loadingScreen.style.display = "none";
      dashboardContent.style.display = "block";
      fundWallet.style.display = "block";

      const userId = user.uid;
      displayUserData(userId);
    } else {
      window.location.href = "login.html";
    }
  });

  if (numberElement) {
    const number = parseFloat(numberElement.textContent.trim());
    if (!isNaN(number)) {
        numberElement.textContent = number.toLocaleString('en-US');
    }
}

  const depositForm = document.getElementById('depositForm');
  depositForm.addEventListener('submit', handleDepositSubmit);
});


// ============== Funding =================//
function handleDepositSubmit(event) {
  event.preventDefault(); // Prevent form from submitting normally

  const crypto = document.getElementById('crypto').value;
  const fundAmount = document.getElementById('fund-amount').value.trim();
  const user = auth.currentUser;

  if (user) {
    const userRef = ref(database, 'users/' + user.uid + '/funding');
    set(userRef, {
      amount: fundAmount
    }).then(() => {
      showPrompt('Please Wait...');
      updateFundAmount(user.uid); // Update the displayed fund amount after saving
    }).catch(error => {
      console.error('Error saving deposit:', error);
      showPrompt('Error saving deposit. Please try again.');
    });
  } else {
    showPrompt('No user is signed in. Please sign in first.');
  }
}

function showPrompt(message) {
  const promptContainer = document.createElement('div');
  promptContainer.textContent = message;
  promptContainer.style.position = 'fixed';
  promptContainer.style.top = '40%';
  promptContainer.style.left = '50%';
  promptContainer.style.transform = 'translateX(-50%)';
  promptContainer.style.backgroundColor = '#133917';
  promptContainer.style.color = '#fff';
  promptContainer.style.padding = '10px 20px';
  promptContainer.style.borderRadius = '5px';
  promptContainer.style.zIndex = '1000';
  document.body.appendChild(promptContainer);

  setTimeout(() => {
    document.body.removeChild(promptContainer);
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
  const depositForm = document.getElementById('depositForm');
  depositForm.addEventListener('submit', handleDepositSubmit);
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
        updateFundAmount(uid); // Update the displayed fund amount when user data is displayed
      }
    })
    .catch((error) => {
      console.error("Error retrieving user data: ", error);
    });
}


// ====================== Retrieving Fund amount data =======================//
function updateFundAmount(uid) {
  const dbRef = ref(database);
  get(child(dbRef, `users/${uid}/funding`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const depositData = snapshot.val();
        const amount = depositData.amount || "0";
        document.querySelectorAll('#re-fund-amount').forEach(element => {
          element.textContent = `$${amount}`;
        });
      } else {
        document.querySelectorAll('#re-fund-amount').forEach(element => {
          element.textContent = "No deposited amount found.";
        });
      }
    })
    .catch((error) => {
      console.error("Error retrieving deposit data: ", error);
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
