import express from 'express';
import { Op } from 'sequelize';
import { sequelize, Book, Category } from '../models/index.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/books
router.get('/books', auth, async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalAvailable = (await Book.sum('available_quantity')) || 0;

    // Prêt pour Luce — gracieux si Borrow pas encore dispo
    let totalBorrowed = 0;
    // totalBorrowed sera calculé depuis Borrow après feat/integration

    const byCategory = await Book.findAll({
      attributes: [
        'category_id',
        [sequelize.fn('COUNT', sequelize.col('Book.id')), 'count'],
      ],
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
      group: ['category_id', 'category.id'],
    });

    res.json({ totalBooks, totalAvailable, totalBorrowed, byCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/members — à brancher quand Luce termine Member
router.get('/members', auth, async (req, res) => {
  res.status(503).json({ message: 'Module membres pas encore disponible' });
});

// GET /api/stats/borrows — à brancher quand Luce termine Borrow
router.get('/borrows', auth, async (req, res) => {
  res.status(503).json({ message: 'Module emprunts pas encore disponible' });
});

export default router;
