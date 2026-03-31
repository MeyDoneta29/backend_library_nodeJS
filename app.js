import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import booksRoutes from './routes/books.js';
import statsRoutes from './routes/stats.js';
import memberRoutes from './routes/members.js';
import borrowRoutes from './routes/borrows.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/borrows', borrowRoutes);

// Middleware erreur global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Erreur interne du serveur' });
});

export default app;
