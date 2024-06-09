import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDosNrhPrcRC2UpOu9Wu3N2p3jaUwbJyDI",
  authDomain: "login-example-c7c78.firebaseapp.com",
  projectId: "login-example-c7c78",
  storageBucket: "login-example-c7c78.appspot.com",
  messagingSenderId: "298272317823",
  appId: "1:298272317823:web:07b88844cd084699197a4a",
  databaseURL: "https://login-example-c7c78-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM Elements
const form = document.getElementById("form");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const submit = document.getElementById("submit");
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");

// Form validation
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Function to check if username already exists in the database
const checkUsernameExists = async (username) => {
  const dbRef = ref(database, `users`);
  try {
    const snapshot = await get(child(dbRef, username));
    return snapshot.exists();
  } catch (error) {
    console.error(error);
    return false;
  }
};

const validateInputs = async () => {
  const firstnameValue = firstname.value.trim();
  const lastnameValue = lastname.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  let isValid = true;

  if (firstnameValue === "") {
    setError(firstname, "First name is required");
    isValid = false;
  } else {
    setSuccess(firstname);
  }

  /* 
  const usernameExists = await checkUsernameExists(usernameValue);
    if (usernameExists) {
      setError(username, "Lastname already taken");
      isValid = false;
    } else {
   */

  if (lastnameValue === "") {
    setError(lastname, "Last name is required");
    isValid = false;
  } else {
    setSuccess(lastname);
  }

  if (emailValue === "") {
    setError(email, "Email is required");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
    isValid = false;
  } else {
    setSuccess(email);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
    isValid = false;
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 characters.");
    isValid = false;
  } else {
    setSuccess(password);
  }

  if (password2Value === "") {
    setError(password2, "Please confirm your password");
    isValid = false;
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords don't match");
    isValid = false;
  } else {
    setSuccess(password2);
  }

  return isValid;
};

// Popup functions
const showPopup = (message) => {
  popupMessage.textContent = message;
  popup.classList.add("show");
};

const closePopup = () => {
  popup.classList.remove("show");
};

// Attach the closePopup function to the close button
document.querySelector(".close").addEventListener("click", closePopup);

// Submit event listener
submit.addEventListener("click", async (event) => {
  event.preventDefault();

  if (await validateInputs()) {
    const emailValue = email.value.trim();
    const firstnameValue = firstname.value.trim();
    const lastnameValue = lastname.value.trim();
    const passwordValue = password.value.trim();

    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        const user = userCredential.user;

        // Store user data in Realtime Database
        set(ref(database, 'users/' + user.uid), {
          firstname: firstnameValue,
          lastname: lastnameValue,
          email: emailValue
        }).then(() => {
          showPopup(
            "Account Created Successfully 😁. Redirecting to Login Page..."
          );
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        }).catch((error) => {
          console.error("Error writing user data:", error);
          showPopup("Error writing user data: " + error.message);
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        showPopup(errorMessage);
      });
  }
});
