import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { auth, db } from "./firebase-config.js";

// Register function
function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ Registered successfully! You can now login.");
    })
    .catch((error) => {
      console.error(error);
      alert("❌ Registration failed: " + error.message);
    });
}

// Login function
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ Logged in!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error(error);
      alert("❌ Login failed: " + error.message);
    });
}

// Mark Attendance
async function markAttendance() {
  const user = auth.currentUser;
  if (!user) {
    alert("⚠️ You must be logged in.");
    return;
  }

  const userDocRef = doc(db, "attendance", user.uid);
  const timestamp = new Date().toISOString();

  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      await updateDoc(userDocRef, {
        count: increment(1),
        records: arrayUnion(timestamp)
      });
    } else {
      await setDoc(userDocRef, {
        count: 1,
        records: [timestamp]
      });
    }

    const updatedSnap = await getDoc(userDocRef);
    const updatedCount = updatedSnap.data().count;

    alert(`✅ Marked!\n🧮 Total: ${updatedCount}\n🕒 Time: ${timestamp}`);
    checkIfTodayMarked();
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Failed to mark attendance.");
  }
}

// Disable mark button if already marked today
async function checkIfTodayMarked() {
  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "attendance", user.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    const records = docSnap.data().records || [];
    const today = new Date().toDateString();

    const alreadyMarked = records.some(r => {
      const date = new Date(r).toDateString();
      return date === today;
    });

    const button = document.querySelector("button[onclick='markAttendance()']");
    if (alreadyMarked && button) {
      button.disabled = true;
      button.textContent = "✅ Already Marked Today";
    }
  }
}

// Show user email on dashboard
onAuthStateChanged(auth, (user) => {
  if (user && document.getElementById("userEmail")) {
    document.getElementById("userEmail").textContent = user.email;
    checkIfTodayMarked();
  }

  // If on history page, load records
  if (user && document.getElementById("attendanceList")) {
    loadHistory(user.uid);
  }

  // If on feed usage history page
  if (user && document.getElementById("feedHistoryBody")) {
    loadFeedHistory();
  }
});

// Load attendance history into UL list
async function loadHistory(uid) {
  const userDocRef = doc(db, "attendance", uid);
  const docSnap = await getDoc(userDocRef);

  const list = document.getElementById("attendanceList");
  list.innerHTML = "";

  if (docSnap.exists()) {
    const records = docSnap.data().records || [];
    records.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = new Date(r).toLocaleString();
      list.appendChild(li);
    });
  } else {
    list.innerHTML = "<li>No attendance records found.</li>";
  }
}

// Logout
function logout() {
  signOut(auth).then(() => {
    alert("🔓 Logged out!");
    window.location.href = "index.html";
  }).catch((error) => {
    console.error(error);
    alert("❌ Logout failed.");
  });
}

// Go back
function goBack() {
  window.location.href = "dashboard.html";
}

// 🔽 NEW: Log Feed Usage
async function logFeedUsage(feedType, amountUsed) {
  try {
    await addDoc(collection(db, "feedHistory"), {
      type: "usage",
      feed: feedType,
      amount: amountUsed,
      timestamp: new Date().toISOString()
    });
    alert("✅ Feed usage logged!");
  } catch (error) {
    console.error("Error logging feed usage:", error);
  }
}

// 🔽 NEW: Log Feed Addition
async function logFeedAddition(feedType, amountAdded) {
  try {
    await addDoc(collection(db, "feedHistory"), {
      type: "addition",
      feed: feedType,
      amount: amountAdded,
      timestamp: new Date().toISOString()
    });
    alert("✅ Feed addition logged!");
  } catch (error) {
    console.error("Error logging feed addition:", error);
  }
}

// 🔽 NEW: Load Feed History Table (if on history page)
async function loadFeedHistory() {
  const tableBody = document.getElementById("feedHistoryBody");
  const q = query(collection(db, "feedHistory"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  tableBody.innerHTML = "";

  if (snapshot.empty) {
    tableBody.innerHTML = "<tr><td colspan='4'>No feed records found.</td></tr>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${data.type === "usage" ? "Used" : "Added"}</td>
      <td>${data.feed}</td>
      <td>${data.amount} kg</td>
      <td>${new Date(data.timestamp).toLocaleString()}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Expose to HTML
window.login = login;
window.logout = logout;
window.markAttendance = markAttendance;
window.goBack = goBack;
window.logFeedUsage = logFeedUsage;
window.logFeedAddition = logFeedAddition;
