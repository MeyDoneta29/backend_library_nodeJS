import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import multer from 'multer';
import { Op } from 'sequelize';
import { Book, Category } from '../models/index.js';
import { bookSchema, bookUpdateSchema } from '../validations/bookValidation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Config Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = join(__dirname, '../uploads');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Format non supporté'));
  },
});

export const getBooks = async (req, res) => {
  try {
    const { search, category_id, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (search) {
      where[Op.or] = [
        { title:  { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category_id) where.category_id = category_id;
    const { count, rows } = await Book.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({
      total:      count,
      page:       parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      books:      rows,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const createBook = async (req, res) => {
  const { error } = bookSchema.validate(req.body, { abortEarly: false });
  if (error) {
    if (req.file) unlinkSync(req.file.path);
    return res.status(400).json({
      message: 'Données invalides',
      errors: error.details.map(d => d.message),
    });
  }
  try {
    const data = { ...req.body };
    if (req.file) data.cover_image = req.file.filename;
    if (!data.available_quantity) data.available_quantity = data.quantity;
    const book = await Book.create(data);
    const withCategory = await Book.findByPk(book.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    return res.status(201).json(withCategory);
  } catch (err) {
    if (req.file) unlinkSync(req.file.path);
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const updateBook = async (req, res) => {
  const { error } = bookUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    if (req.file) unlinkSync(req.file.path);
    return res.status(400).json({
      message: 'Données invalides',
      errors: error.details.map(d => d.message),
    });
  }
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre introuvable' });
    const data = { ...req.body };
    if (req.file) {
      if (book.cover_image) {
        const oldPath = join(__dirname, '../uploads', book.cover_image);
        if (existsSync(oldPath)) unlinkSync(oldPath);
      }
      data.cover_image = req.file.filename;
    }
    await book.update(data);
    const updated = await Book.findByPk(book.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre introuvable' });
    if (book.cover_image) {
      const imgPath = join(__dirname, '../uploads', book.cover_image);
      if (existsSync(imgPath)) unlinkSync(imgPath);
    }
    await book.destroy();
    return res.status(200).json({ message: 'Livre supprimé' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
