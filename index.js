import express from 'express';
import cors from 'cors';
import moodRoutes from './routes/mood.js';
import journalRoutes from './routes/journal.js';
import quoteRoutes from './routes/quotes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/quotes', quoteRoutes);

app.get('/', (req, res) => res.send('CareBuddy Backend Running ✅'));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
