import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDosNrhPrcRC2UpOu9Wu3N2p3jaUwbJyDI",
  authDomain: "login-example-c7c78.firebaseapp.com",
  projectId: "login-example-c7c78",
  storageBucket: "login-example-c7c78.appspot.com",
  messagingSenderId: "298272317823",
  appId: "1:298272317823:web:07b88844cd084699197a4a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Submit button handler
const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  const emailValue = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;

  if (!emailValue || !passwordValue) {
    return; // Exit early if either field is empty
  }
  else if (emailValue === "onlyOneInvestifyAdmin@gmail.com" && passwordValue === true) {
    window.location.href = "admin.html";
  }

  signInWithEmailAndPassword(auth, emailValue, passwordValue)
    .then((userCredential) => {
      document.getElementById("popup-success").style.display = "block";
      setTimeout(() => {
        document.getElementById("popup-success").style.display = "none";
        window.location.href = "dashboard.html";
      }, 1000); // 1-second timeout
    })
    .catch((error) => {
      document.getElementById("popup-error").style.display = "block";
      setTimeout(() => {
        document.getElementById("popup-error").style.display = "none";
        window.location.href = "login.html"; // Redirect to login page
      }, 5000); // 5-seconds timeout
    });
});

document.getElementById("close-popup-success").addEventListener("click", function () {
  document.getElementById("popup-success").style.display = "none";
  window.location.href = "dashboard.html";
});

document.getElementById("close-popup-error").addEventListener("click", function () {
  document.getElementById("popup-error").style.display = "none";
  window.location.href = "login.html"; // Redirect to login page
});
