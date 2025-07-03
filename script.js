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
    });
  });
  
  // ========== 2. Quote Generator ==========
  async function getQuote() {
    try {
      const res = await fetch("https://zenquotes.io/api/random");
      const data = await res.json();
      document.getElementById("quote").innerText = data[0].q + " — " + data[0].a;
    } catch (error) {
      document.getElementById("quote").innerText = "Couldn't load quote. Try again!";
    }
  }
  
  // ========== 3. Journal Entry ==========
  function saveEntry() {
    const entry = document.getElementById('journal-entry').value;
    if (!entry) return alert("Entry is empty!");
  
    const date = new Date().toLocaleString();
    const logs = JSON.parse(localStorage.getItem('journalLogs')) || [];
    logs.push({ date, entry });
    localStorage.setItem('journalLogs', JSON.stringify(logs));
    localStorage.setItem('journalEntry', entry);
    displayLogs();
    alert("Saved!");
  }
  
  function deleteEntry() {
    if (confirm("Delete all journal entries?")) {
      localStorage.removeItem('journalLogs');
      document.getElementById('entry-list').innerHTML = '';
      alert("All entries deleted.");
    }
  }
  
  function displayLogs() {
    const list = document.getElementById('entry-list');
    const logs = JSON.parse(localStorage.getItem('journalLogs')) || [];
    list.innerHTML = logs.reverse().map(log => `
      <li class="list-group-item small">
        <strong>${log.date}</strong><br>${log.entry}
      </li>
    `).join('');
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
  
    // Last entry
    document.getElementById('journal-entry').value = localStorage.getItem('journalEntry') || '';
  
    // Logs
    displayLogs();
  
    // Quote
    getQuote();
  };
  