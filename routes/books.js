import express from 'express';
import Joi from 'joi';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { Op } from 'sequelize';
import { Book, Category } from '../models/index.js';
import { auth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Format non supporté'));
  },
});

// Schémas Joi
const bookSchema = Joi.object({
  title:              Joi.string().min(1).max(255).required(),
  author:             Joi.string().min(1).max(255).required(),
  isbn:               Joi.string().max(20).allow('', null).optional(),
  category_id:        Joi.number().integer().required(),
  quantity:           Joi.number().integer().min(1).required(),
  available_quantity: Joi.number().integer().min(0).optional(),
  description:        Joi.string().max(1000).allow('', null).optional(),
});

// Fork : tous les champs deviennent optionnels pour PUT
const bookUpdateSchema = bookSchema.fork(
  ['title', 'author', 'category_id', 'quantity'],
  field => field.optional()
);

// GET /api/books
router.get('/', auth, async (req, res) => {
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
    res.json({
      total:      count,
      page:       parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      books:      rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
