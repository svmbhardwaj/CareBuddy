// =======================
// Firebase Configuration
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDRq0tk89rnE1zqExkhEyAerCeOM6MCBCE",
  authDomain: "carebuddy-ecfb2.firebaseapp.com",
  projectId: "carebuddy-ecfb2",
  storageBucket: "carebuddy-ecfb2.firebasestorage.app",
  messagingSenderId: "914654382502",
  appId: "1:914654382502:web:83ad470c80c1f409606767",
  measurementId: "G-9ZCG045B75"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ========== 1. Mood Tracker + Chatbot Reply ==========
const moodReplies = {
  happy: "That's awesome! Keep spreading joy 😊",
  sad: "It's okay to feel sad sometimes. I'm here for you 💙",
  angry: "Take a deep breath. You're doing your best 😌",
  anxious: "Try journaling or taking a break. You've got this 💪",
  excited: "Woohoo! Ride that wave of positivity 🎉"
};

document.querySelectorAll('.emoji').forEach(emoji => {
  emoji.addEventListener('click', () => {
    const mood = emoji.dataset.mood;
    const replyBox = document.getElementById('chatbot-reply');
    replyBox.classList.remove('d-none');
    replyBox.innerText = moodReplies[mood];

    // Highlight selected mood
    document.querySelectorAll('.emoji').forEach(e => e.removeAttribute("data-selected"));
    emoji.setAttribute("data-selected", "true");

    // 🔥 Save mood to Firestore
    db.collection("moodLogs").add({
      mood: mood,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      console.log("Mood saved:", mood);
    }).catch(err => {
      console.error("Error saving mood:", err);
    });
  });
});

// ========== 2. Quote Generator ==========
async function getQuote() {
  const quoteBox = document.getElementById("quote");
  try {
    const res = await fetch("https://api.realinspire.live/v1/quotes/random?limit=1");
    const [data] = await res.json();
    quoteBox.innerText = `${data.content} — ${data.author}`;
  } catch (err) {
    console.error("Quote error:", err);
    quoteBox.innerText = "Couldn't load quote. Try again!";
  }
}



// ========== 3. Journal Entry ==========
function saveEntry() {
  const entry = document.getElementById('journal-entry').value;
  if (!entry) return alert("Entry is empty!");

  const mood = document.querySelector('.emoji[data-selected="true"]')?.dataset.mood || "unspecified";
  const date = new Date().toLocaleString();

  db.collection("journalEntries").add({
    text: entry,
    mood: mood,
    date: date,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Saved to cloud!");
    document.getElementById('journal-entry').value = "";
    displayLogs();
  }).catch((error) => {
    console.error("Error writing to Firestore: ", error);
  });
}

function deleteEntry() {
  if (confirm("Delete ALL journal entries from the cloud?")) {
    db.collection("journalEntries").get().then(snapshot => {
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    }).then(() => {
      alert("All entries deleted from Firestore.");
      displayLogs();
    }).catch((error) => {
      console.error("Error deleting entries:", error);
    });
  }
}

function displayLogs() {
  const list = document.getElementById('entry-list');
  list.innerHTML = '';

  db.collection("journalEntries")
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const log = doc.data();
        const li = document.createElement('li');
        li.className = "list-group-item small";
        li.innerHTML = `<strong>${log.date}</strong><br>${log.mood ? "[" + log.mood + "] " : ""}${log.text}`;
        list.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Error fetching entries:", error);
    });
}

// ========== 4. Light/Dark Mode Toggle ==========
const toggleBtn = document.getElementById('mode-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// ========== 5. Initial Page Load ==========
window.onload = () => {
  // Theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(`${savedTheme}-mode`);

  // Clear journal text input
  document.getElementById('journal-entry').value = "";

  // Load entries
  displayLogs();

  // Get quote
  getQuote();
};
