// =======================
// Dynamic Backend Config Loader (Option 2)
// =======================

let MONGODB_API_URL = '';

async function loadConfig() {
  try {
    const res = await fetch('/config');
    const data = await res.json();
    MONGODB_API_URL = data.apiUrl;
    console.log('✅ API URL loaded:', MONGODB_API_URL);
  } catch (err) {
    console.error('❌ Failed to load config:', err);
    showNotification('⚠️ Failed to connect to server', 'error');
  }
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info', duration = 3000) {
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideInRight 0.4s ease reverse';
    setTimeout(() => notif.remove(), 400);
  }, duration);
}

// ========== LOADING INDICATOR ==========
function showLoading(elementId, show = true) {
  const element = document.getElementById(elementId);
  if (!element) return;

  if (show) {
    element.innerHTML = '<li class="list-group-item text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Loading...</li>';
  }
}

// ========== MONGODB HELPER FUNCTIONS ==========
async function mongoFetch(endpoint, method = 'GET', data = null) {
  if (!MONGODB_API_URL) {
    throw new Error('API URL not loaded yet');
  }

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${MONGODB_API_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('MongoDB API error:', error);
    showNotification('Failed to connect to server. Check your backend.', 'error');
    throw error;
  }
}
// ========== 1. MOOD TRACKER + SENTIMENT ANALYSIS ==========

const moodReplies = {
  happy: "That's awesome! Keep spreading joy 😊",
  sad: "It's okay to feel sad. Remember, I'm here for you 💙",
  angry: "Take a deep breath. You're stronger than you think 💪",
  anxious: "Try some deep breathing or a quick walk. You've got this 🌟",
  excited: "Woohoo! That energy is contagious 🎉",
  neutral: "Thanks for sharing. I'm here to listen 👂"
};

const moodColors = {
  happy: '#34d399',
  sad: '#60a5fa',
  angry: '#ef4444',
  anxious: '#fbbf24',
  excited: '#f472b6',
  neutral: '#9ca3af'
};

// Enhanced sentiment analysis with more keywords
const sentimentKeywords = {
  happy: ['happy', 'joyful', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'perfect', 'blessed', 'grateful', 'excited', 'thrilled', 'delighted', 'awesome', 'beautiful', 'smiling', 'laughing', 'celebrate'],
  sad: ['sad', 'depressed', 'lonely', 'heartbroken', 'miserable', 'unhappy', 'devastated', 'down', 'terrible', 'awful', 'hopeless', 'crying', 'blue', 'disappointed', 'hurt'],
  angry: ['angry', 'furious', 'enraged', 'frustrated', 'mad', 'irritated', 'annoyed', 'hate', 'outraged', 'upset', 'livid', 'fed up'],
  anxious: ['anxious', 'worried', 'stressed', 'nervous', 'afraid', 'scared', 'panic', 'uncertain', 'fearful', 'overwhelmed', 'dread', 'uneasy'],
  excited: ['excited', 'thrilled', 'pumped', 'stoked', "can't wait", 'incredible', 'hyped', 'psyched', 'eager']
};

// Detect mood from text
function detectMoodFromText(text) {
  if (!text || text.length < 3) return 'neutral';

  const lowerText = text.toLowerCase();
  const scores = {};

  for (const [mood, keywords] of Object.entries(sentimentKeywords)) {
    scores[mood] = keywords.filter(keyword => lowerText.includes(keyword)).length;
  }

  const detectedMood = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  return scores[detectedMood] > 0 ? detectedMood : 'neutral';
}

// Show chatbot reply with animation
function showChatbotReply(mood) {
  const replyBox = document.getElementById('chatbot-reply');
  if (!replyBox) return;

  replyBox.classList.remove('d-none');
  replyBox.style.borderLeftColor = moodColors[mood];
  replyBox.innerText = moodReplies[mood];

  // Highlight selected mood emoji
  document.querySelectorAll('.emoji').forEach(e => e.removeAttribute("data-selected"));
  const selectedEmoji = document.querySelector(`.emoji[data-mood="${mood}"]`);
  if (selectedEmoji) selectedEmoji.setAttribute("data-selected", "true");
}

// Manual mood selection via emoji
function initMoodEmojiHandlers() {
  const emojis = document.querySelectorAll('.emoji');
  if (!emojis.length) return;

  emojis.forEach(emoji => {
    emoji.addEventListener('click', async () => {
      const mood = emoji.dataset.mood;
      showChatbotReply(mood);

      try {
        await mongoFetch('/moodLogs', 'POST', {
          mood: mood,
          timestamp: new Date().toISOString()
        });
        showNotification(`Mood recorded: ${mood.toUpperCase()}!`, 'success', 2000);
      } catch (err) {
        showNotification('Failed to save mood', 'error');
      }
    });
  });
}

// Auto-detect mood as user types
function initMoodAutoDetect() {
  const journalInput = document.getElementById('journal-entry');
  if (!journalInput) return;

  journalInput.addEventListener('input', () => {
    const detectedMood = detectMoodFromText(journalInput.value);
    if (journalInput.value.length > 0) {
      showChatbotReply(detectedMood);
    }
  });
}
// ========== 3. JOURNAL ENTRY WITH VALIDATION ==========

async function saveEntry() {
  const entryEl = document.getElementById('journal-entry');
  if (!entryEl) return;

  const entry = entryEl.value.trim();

  if (!entry) {
    showNotification('📝 Write something to save!', 'info');
    return;
  }

  if (entry.length < 5) {
    showNotification('✏️ Please write a bit more (at least 5 characters)', 'info');
    return;
  }

  const detectedMood = detectMoodFromText(entry);
  const date = new Date().toLocaleString();

  try {
    const saveBtn = document.querySelector('button[onclick="saveEntry()"]');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    }

    await mongoFetch('/journalEntries', 'POST', {
      text: entry,
      mood: detectedMood,
      date: date,
      timestamp: new Date().toISOString()
    });

    showNotification(`✨ Entry saved! Mood: ${detectedMood.toUpperCase()}`, 'success');
    entryEl.value = "";
    await displayLogs();

    const replyBox = document.getElementById('chatbot-reply');
    if (replyBox) replyBox.classList.add('d-none');

  } catch (error) {
    console.error("Error writing to MongoDB: ", error);
    showNotification('❌ Error saving entry. Please try again.', 'error');
  } finally {
    const saveBtn = document.querySelector('button[onclick="saveEntry()"]');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '💾 Save';
    }
  }
}

async function deleteEntry() {
  if (!confirm("🗑️ Delete ALL journal entries? This cannot be undone!")) {
    return;
  }

  try {
    const deleteBtn = document.querySelector('button[onclick="deleteEntry()"]');
    if (deleteBtn) {
      deleteBtn.disabled = true;
      deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Deleting...';
    }

    await mongoFetch('/journalEntries', 'DELETE');
    showNotification('✅ All entries deleted', 'success');
    await displayLogs();

  } catch (error) {
    console.error("Error deleting entries:", error);
    showNotification('❌ Error deleting entries', 'error');
  } finally {
    const deleteBtn = document.querySelector('button[onclick="deleteEntry()"]');
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.innerHTML = '🗑️ Delete All';
    }
  }
}

async function displayLogs() {
  const list = document.getElementById('entry-list');
  if (!list) return;

  showLoading('entry-list', true);

  try {
    const data = await mongoFetch('/journalEntries?sort=timestamp&order=desc');

    if (!data || data.length === 0) {
      list.innerHTML = '<li class="list-group-item text-center text-muted py-4">📭 No entries yet. Start sharing your thoughts!</li>';
      return;
    }

    list.innerHTML = '';
    data.forEach((log) => {
      const li = document.createElement('li');
      li.className = "list-group-item";

      const moodEmoji = {
        happy: '😊', sad: '💙', angry: '😡', anxious: '⚡', excited: '🎉', neutral: '😐'
      };

      const entryDate = new Date(log.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <strong>📅 ${entryDate}</strong>
            <span class="badge" style="background: ${moodColors[log.mood] || '#999'}">
              ${moodEmoji[log.mood] || '❓'} ${log.mood}
            </span>
          </div>
        </div>
        <p class="mb-0 text-break">${escapeHtml(log.text)}</p>
      `;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
    list.innerHTML = '<li class="list-group-item text-center text-danger">❌ Error loading entries</li>';
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
// ========== 2. QUOTE GENERATOR ==========

function getQuote() {
  const quoteBox = document.getElementById("quote");
  if (!quoteBox) return;

  quoteBox.innerText = "✨ Loading inspiration...";

  $.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/quotes',
    headers: { 'X-Api-Key': 'T4/do0qset1+L2mNhc62Ww==wmmyxCTW9hmGiowx' },
    success: function (result) {
      if (result && result.length > 0) {
        const quote = result[0];
        quoteBox.innerHTML = `<p style="margin: 0;">"${quote.quote}"</p><small style="color: #999;">— ${quote.author}</small>`;
        quoteBox.style.fontStyle = "italic";
      }
    },
    error: function () {
      quoteBox.innerText = "💭 Couldn't load quote. Try again!";
    }
  });
}

// ========== AFFIRMATIONS ==========

const affirmations = [
  "You are braver than you believe 💪",
  "Your potential is unlimited ✨",
  "Today is full of possibilities 🌟",
  "You deserve kindness, especially from yourself 💜",
  "Progress, not perfection ✓",
  "Your mental health matters 🧠",
  "You are doing better than you think 🌈",
  "Small steps lead to big changes 👣",
  "Your feelings are valid 💙",
  "You're allowed to take breaks 🌸",
  "Healing is not linear, and that's okay 🌿",
  "You have survived 100% of your worst days 💪",
  "Your story isn't over yet 📖",
  "Be gentle with yourself 🤍",
  "You are enough, just as you are ✨",
  "Every moment is a fresh start 🌅",
  "Your voice matters 🎤",
  "You're growing stronger every day 🌱",
  "It's okay to ask for help 🤝",
  "You've already overcome so much 🏆",
  "Your peace is worth protecting 🕊️",
  "Life gets better when you reach out 🌟",
  "You are worthy of love and respect 👑",
  "Gratitude opens doors to joy 🚪",
  "This too shall pass 🌙"
];

function initAffirmationButton() {
  const btn = document.getElementById('affirmation-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    btn.classList.add('affirmation-pulse');
    setTimeout(() => btn.classList.remove('affirmation-pulse'), 600);

    let display = document.getElementById('affirmation-display');
    if (!display) {
      display = document.createElement('div');
      display.id = 'affirmation-display';
      btn.parentElement.appendChild(display);
    }

    display.innerHTML = `<span>${randomAffirmation}</span>`;
    showNotification(randomAffirmation, 'info', 4000);
    createConfetti();
  });
}

// ========== BREATHING EXERCISE ==========

function initBreathingButton() {
  const btn = document.getElementById('breathing-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    document.getElementById('breathing-modal')?.classList.remove('d-none');
    document.getElementById('breathing-overlay')?.classList.remove('d-none');
    startBreathingExercise();
  });
}

function closeBreathingModal() {
  document.getElementById('breathing-modal')?.classList.add('d-none');
  document.getElementById('breathing-overlay')?.classList.add('d-none');
  showNotification('✨ Great job! You did amazing!', 'success', 3000);
}

function startBreathingExercise() {
  const sequence = [
    { text: '🫁 Breathe In', duration: 4000 },
    { text: '⏸️ Hold', duration: 7000 },
    { text: '💨 Breathe Out', duration: 8000 },
    { text: '✨ Calm', duration: 2000 }
  ];

  let index = 0;

  function nextPhase() {
    if (index < sequence.length) {
      const phase = sequence[index];
      const el = document.getElementById('breathing-text');
      if (el) el.textContent = phase.text;
      index++;
      setTimeout(nextPhase, phase.duration);
    }
  }

  nextPhase();
}

// ========== CONFETTI ==========

function createConfetti() {
  for (let i = 0; i < 8; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = ['#667eea', '#764ba2', '#f472b6', '#34d399'][Math.floor(Math.random() * 4)];
    confetti.style.borderRadius = '50%';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '20%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1001';

    document.body.appendChild(confetti);

    const duration = 2000 + Math.random() * 1000;
    const xMovement = (Math.random() - 0.5) * 300;
    const yMovement = 300 + Math.random() * 200;

    confetti.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${xMovement}px, ${yMovement}px) rotate(360deg)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    setTimeout(() => confetti.remove(), duration);
  }
}
// ========== 5. INITIAL PAGE LOAD ==========

window.addEventListener('DOMContentLoaded', async () => {
  try {
    // 1️⃣ Load backend config FIRST
    await loadConfig();

    // 2️⃣ Theme setup
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`${savedTheme}-mode`);

    // 3️⃣ Clear journal input
    const journalEntry = document.getElementById('journal-entry');
    if (journalEntry) {
      journalEntry.value = "";
    }

    // 4️⃣ Character counter
    if (journalEntry) {
      journalEntry.addEventListener('input', () => {
        const charCount = journalEntry.value.length;
        let counter = document.getElementById('char-counter');

        if (!counter) {
          counter = document.createElement('div');
          counter.id = 'char-counter';
          counter.className = 'char-count';
          journalEntry.parentNode.insertBefore(counter, journalEntry.nextSibling);
        }

        counter.textContent = `${charCount} characters`;
        if (charCount > 500) {
          counter.style.color = '#ef4444';
        } else if (charCount > 300) {
          counter.style.color = '#fbbf24';
        } else {
          counter.style.color = '#999';
        }
      });
    }

    // 5️⃣ Initialize all features AFTER config is loaded
    initMoodEmojiHandlers();
    initMoodAutoDetect();
    initAffirmationButton();
    initBreathingButton();

    // 6️⃣ Load journal entries
    await displayLogs();

    // 7️⃣ Load quote
    getQuote();
    setInterval(getQuote, 60000);

    // 8️⃣ Welcome message
    showNotification('👋 Welcome to CareBuddy! Share your feelings and track your mood.', 'info', 4000);

  } catch (err) {
    console.error('Startup error:', err);
    showNotification('❌ App failed to initialize', 'error');
  }
});
