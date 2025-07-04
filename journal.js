import express from 'express';
import db from '../firebaseAdmin.js';

const router = express.Router();

router.post('/log', async (req, res) => {
  const { mood, emoji } = req.body;

  try {
    await db.collection('moods').add({
      mood,
      emoji,
      timestamp: new Date(),
    });
    res.status(200).json({ message: 'Mood logged successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

export default router;
