import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_rPTK-dEGNlz3kfFx3WTS579Fz0xt0nk",
  authDomain: "attendance-system-31208.firebaseapp.com",
  projectId: "attendance-system-31208",
  storageBucket: "attendance-system-31208.firebasestorage.app",
  messagingSenderId: "340644375850",
  appId: "1:340644375850:web:a13eabd90f4dfbcdd80253"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
