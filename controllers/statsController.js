import { Op } from 'sequelize';
import { sequelize, Book, Category } from '../models/index.js';

export const getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalAvailable = (await Book.sum('available_quantity')) || 0;

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

    return res.status(200).json({ totalBooks, totalAvailable, totalBorrowed, byCategory });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const getMemberStats = async (req, res) => {
  return res.status(503).json({ message: 'Module membres pas encore disponible' });
};

export const getBorrowStats = async (req, res) => {
  return res.status(503).json({ message: 'Module emprunts pas encore disponible' });
};
