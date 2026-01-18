const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ========== VALIDATION ==========
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env');
  process.exit(1);
}

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// Optional: serve frontend
app.use(express.static('public'));

// ========== MONGODB ==========
let db;
const client = new MongoClient(MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db('carebuddy');
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// ========== CONFIG ENDPOINT ==========
app.get('/config', (req, res) => {
  res.json({
    apiUrl: `${req.protocol}://${req.get('host')}/api`
  });
});

// ========== HEALTH ==========
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// ========== MOOD LOGS ==========

app.post('/api/moodLogs', async (req, res) => {
  try {
    const { mood, timestamp } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const result = await db.collection('moodLogs').insertOne({
      mood,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date()
    });

    res.status(201).json({ 
      success: true, 
      id: result.insertedId,
      message: 'Mood saved successfully'
    });
  } catch (error) {
    console.error('Error saving mood:', error);
    res.status(500).json({ error: 'Failed to save mood' });
  }
});

app.get('/api/moodLogs', async (req, res) => {
  try {
    const logs = await db.collection('moodLogs')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    res.json(logs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ error: 'Failed to fetch mood logs' });
  }
});

// ========== JOURNAL ENTRIES ==========

app.post('/api/journalEntries', async (req, res) => {
  try {
    const { text, mood, date, timestamp } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Journal text is required' });
    }

    const result = await db.collection('journalEntries').insertOne({
      text,
      mood: mood || 'neutral',
      date: date || new Date().toLocaleString(),
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date()
    });

    res.status(201).json({ 
      success: true, 
      id: result.insertedId,
      message: 'Journal entry saved successfully'
    });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
});

app.get('/api/journalEntries', async (req, res) => {
  try {
    const sort = req.query.sort || 'timestamp';
    const order = req.query.order === 'asc' ? 1 : -1;

    const entries = await db.collection('journalEntries')
      .find({})
      .sort({ [sort]: order })
      .toArray();

    res.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

app.delete('/api/journalEntries', async (req, res) => {
  try {
    const result = await db.collection('journalEntries').deleteMany({});

    res.json({ 
      success: true, 
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} entries deleted`
    });
  } catch (error) {
    console.error('Error deleting journal entries:', error);
    res.status(500).json({ error: 'Failed to delete journal entries' });
  }
});

// ========== ERROR HANDLING ==========

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ========== START SERVER ==========

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 CareBuddy backend running on http://localhost:${PORT}`);
    console.log(`📝 API base URL: http://localhost:${PORT}/api`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// ========== GRACEFUL SHUTDOWN ==========

process.on('SIGINT', async () => {
  console.log('\n⛔ Shutting down server...');
  await client.close();
  process.exit(0);
});
