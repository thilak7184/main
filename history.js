import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const list = document.getElementById("attendanceList");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("⚠️ Please login.");
    window.location.href = "index.html";
    return;
  }

  const userDocRef = doc(db, "attendance", user.uid);

  try {
    const snap = await getDoc(userDocRef);
    list.innerHTML = "";

    if (snap.exists()) {
      const data = snap.data();
      const records = data.records || [];

      if (records.length === 0) {
        list.innerHTML = "<li>No attendance marked yet.</li>";
      } else {
        records.forEach((t, i) => {
          const li = document.createElement("li");
          li.textContent = `${i + 1}. ${new Date(t).toLocaleString()}`;
          list.appendChild(li);
        });
      }
    } else {
      list.innerHTML = "<li>No attendance record found.</li>";
    }
  } catch (err) {
    console.error(err);
    list.innerHTML = "<li>Error loading data.</li>";
  }
});
