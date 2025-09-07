import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC_rPTK-dEGNlz3kfFx3WTS579Fz0xt0nk",
    authDomain: "attendance-system-31208.firebaseapp.com",
    projectId: "attendance-system-31208",
    storageBucket: "attendance-system-31208.appspot.com", // fixed
    messagingSenderId: "340644375850",
    appId: "1:340644375850:web:a13eabd90f4dfbcdd80253"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            document.getElementById("error").style.display = "none";
            alert("Login successful!");
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error(error.code, error.message);
            const errorBox = document.getElementById("error");
            errorBox.style.display = "block";

            if (error.code === "auth/user-not-found") {
                errorBox.textContent = "No account found for this email!";
            } else if (error.code === "auth/wrong-password") {
                errorBox.textContent = "Wrong password!";
            } else if (error.code === "auth/invalid-email") {
                errorBox.textContent = "Invalid email format!";
            } else {
                errorBox.textContent = "Login failed: " + error.message;
            }
        });
};
