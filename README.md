# CareBuddy - Mental Health & Mood Journal App

A compassionate, full-stack web application that helps users track their emotions, journal their thoughts, and access wellness resources. Built with **MongoDB**, **Node.js/Express**, and **Vanilla JavaScript**.

## 🎯 Features

### Core Features
- **💭 Mood Tracker**: Click emojis to manually select your mood or auto-detect from journal entries
- **📝 Journal Entries**: Write freely with automatic sentiment analysis
- **✨ Daily Motivation**: Get inspiring quotes refreshed every minute
- **🌙 Dark/Light Mode**: Toggle between themes with persistent storage
- **📊 Mood Detection**: AI-powered sentiment analysis on journal text

### Recent Improvements (v2.0)
✨ **Enhanced UI/UX**
- Modern gradient-based design with purple & teal theme
- Smooth animations and transitions
- Beautiful emoji-based mood indicators with color coding
- Responsive design for all devices

🔔 **Smart Notifications**
- Real-time toast notifications for actions
- Success/error/info message types
- Auto-dismissing notifications

📈 **Better Sentiment Analysis**
- Expanded keyword library (70+ emotional keywords)
- More accurate mood detection
- Real-time mood preview as you type

⚡ **Improved UX**
- Character counter for journal entries
- Form validation with helpful feedback
- Loading states and disabled buttons during API calls
- XSS protection with HTML escaping

🎨 **Design Enhancements**
- Premium gradient backgrounds
- Mood-specific color indicators
- Hover effects and interactive feedback
- Accessible buttons with ARIA labels

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MongoDB Atlas** - Cloud database
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Semantic markup
- **Bootstrap 5** - Responsive grid system
- **Vanilla JavaScript** - No jQuery dependencies (except quotes API)
- **CSS3** - Custom animations and gradients

### APIs
- **Quotes API** - api-ninjas.com for daily quotes
- **MongoDB API** - Atlas cloud database

## 📁 Project Structure

```
CareBuddy/
├── Public/
│   ├── index.html          # Main HTML (improved semantic structure)
│   ├── style.css           # Modern CSS with animations
│   ├── script.js           # Enhanced JavaScript with notifications
│   └── .env                # Frontend API configuration
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Dependencies
│   ├── .env                # Backend MongoDB credentials
│   └── node_modules/
├── README.md               # This file
└── .gitignore              # Git ignore rules
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free tier available)
- Modern web browser

### Backend Setup

1. **Navigate to backend folder:**
```bash
cd CareBuddy/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables** (`.env`):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carebuddy
PORT=5000
NODE_ENV=development
```

4. **Start the server:**
```bash
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Open Public folder in a server** (required for .env loading):
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server
```

2. **Visit in browser:**
```
http://localhost:8000
```

## 📚 API Endpoints

### Mood Logs
```
POST   /api/moodLogs       - Save a mood entry
GET    /api/moodLogs       - Get all mood logs
```

### Journal Entries
```
POST   /api/journalEntries              - Save new journal entry
GET    /api/journalEntries?sort=X&order=Y - Fetch entries (sorted)
DELETE /api/journalEntries              - Delete all entries
```

### Health Check
```
GET    /api/health         - Server status
```

## 🎯 Sentiment Analysis Keywords

### Happy (18 keywords)
happy, joyful, great, wonderful, amazing, fantastic, love, perfect, blessed, grateful, excited, thrilled, delighted, awesome, beautiful, smiling, laughing, celebrate

### Sad (17 keywords)
sad, depressed, lonely, heartbroken, miserable, unhappy, devastated, down, depressing, terrible, awful, hopeless, crying, blue, disappointed, hurt, aching

### Angry (15 keywords)
angry, furious, enraged, frustrated, mad, irritated, annoyed, hate, despise, outraged, upset, pissed, livid, fed up

### Anxious (14 keywords)
anxious, worried, stressed, nervous, afraid, scared, panic, uncertain, fearful, overwhelmed, tension, concern, dread, uneasy, restless

### Excited (11 keywords)
excited, thrilled, pumped, stoked, can't wait, amazing, incredible, fantastic, awesome, hyped, psyched, eager, anticipating

## 🎨 Color Scheme

| Mood | Color | Emoji |
|------|-------|-------|
| Happy | #34d399 (Green) | 😊 |
| Sad | #60a5fa (Blue) | 😢 |
| Angry | #ef4444 (Red) | 😠 |
| Anxious | #fbbf24 (Amber) | 😰 |
| Excited | #f472b6 (Pink) | 🤩 |
| Neutral | #9ca3af (Gray) | 😐 |

## 🔒 Security Features

✅ **XSS Protection** - HTML escaping on user input
✅ **CORS Enabled** - Controlled cross-origin requests
✅ **Environment Variables** - Sensitive data in .env files
✅ **Error Handling** - Graceful error messages
✅ **Input Validation** - Minimum length validation

## 🌙 Dark Mode

- Automatically saves preference to localStorage
- Smooth transition between themes
- All components styled for both modes
- Better accessibility with proper contrast

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly buttons
- Adaptive layouts

## 🚀 Future Enhancements

- [ ] User authentication system
- [ ] Mood statistics and charts
- [ ] Data export (PDF/CSV)
- [ ] Email reminders
- [ ] Social sharing
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Therapy resource matching

## 🤝 Contributing

Improvements welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a pull request

## 📄 License

This project is open-source and available under the MIT License.

## 💙 Support

If you're struggling with your mental health:
- 🇮🇳 **India**: Your Dost (yourdost.com), iCall (9152987821)
- 🌍 **Global**: International Association for Suicide Prevention (iasp.info)

Remember: **You are not alone. Reach out for help when you need it.**

---

**Made with 💙 for your mental wellness**
