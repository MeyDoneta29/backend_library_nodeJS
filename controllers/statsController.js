import { Op } from 'sequelize';
import { sequelize, Book, Category, Member, Borrow } from '../models/index.js';

export const getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalAvailable = (await Book.sum('available_quantity')) || 0;

    const totalBorrowed = await Borrow.count({ where: { status: 'borrowed' } });

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

export const getMemberStats = async (_req, res) => {
  try {
    const totalMembers = await Member.count();
    const activeMembers = await Member.count({ where: { status: 'active' } });
    const inactiveMembers = await Member.count({ where: { status: 'inactive' } });

    return res.status(200).json({ totalMembers, activeMembers, inactiveMembers });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const getBorrowStats = async (_req, res) => {
  try {
    const totalBorrows = await Borrow.count();
    const activeBorrows = await Borrow.count({ where: { status: 'borrowed' } });
    const returnedBorrows = await Borrow.count({ where: { status: 'returned' } });
    const overdueBorrows = await Borrow.count({ where: { status: 'overdue' } });

    return res.status(200).json({ totalBorrows, activeBorrows, returnedBorrows, overdueBorrows });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
