import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/motivation', async (req, res) => {
  try {
    const { data } = await axios.get('https://type.fit/api/quotes');
    const random = data[Math.floor(Math.random() * data.length)];
    res.json(random);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch quote' });
  }
});

router.get('/affirmation', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.affirmations.dev/');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch affirmation' });
  }
});

export default router;
