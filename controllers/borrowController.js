import Borrow from '../models/Borrow.js';
import Member from '../models/Member.js';
import Book from '../models/Book.js';
import { borrowSchema } from '../validations/borrowValidation.js';


export const getBorrows = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: borrows } = await Borrow.findAndCountAll({
      where,
      include: [
        { model: Member, attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Book, attributes: ['id', 'title', 'author'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      borrows
    });

  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


export const createBorrow = async (req, res) => {
  try {
    const { error } = borrowSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { member_id, book_id, due_date } = req.body;

    // Vérifier que le membre existe et est actif
    const member = await Member.findByPk(member_id);
    if (!member) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }
    if (member.status !== 'active') {
      return res.status(400).json({ message: 'Le membre doit être actif pour emprunter' });
    }

    // Vérifier que le livre existe et est disponible
    const book = await Book.findByPk(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    if (book.available_quantity < 1) {
      return res.status(400).json({ message: 'Livre non disponible' });
    }

    // Créer l'emprunt
    const borrow = await Borrow.create({
      member_id,
      book_id,
      due_date,
      status: 'borrowed'
    });

    // Décrémenter la quantité disponible
    await book.update({
      available_quantity: book.available_quantity - 1
    });

    return res.status(201).json({
      message: 'Emprunt créé avec succès',
      borrow
    });

  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const returnBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findByPk(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: 'Emprunt non trouvé' });
    }

    // Vérifier si le livre est déjà retourné
    if (borrow.status === 'returned') {
      return res.status(400).json({ message: 'Ce livre a déjà été retourné' });
    }

    // Mettre à jour l'emprunt
    await borrow.update({
      return_date: new Date(),
      status: 'returned'
    });

    // Incrémenter la quantité disponible
    const book = await Book.findByPk(borrow.book_id);
    await book.update({
      available_quantity: book.available_quantity + 1
    });

    return res.status(200).json({
      message: 'Livre retourné avec succès',
      borrow
    });

  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};