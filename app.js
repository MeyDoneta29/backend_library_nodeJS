import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);

export default app;