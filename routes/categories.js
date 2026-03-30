import express from 'express';
import Joi from 'joi';
import { Category, Book } from '../models/index.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const categorySchema = Joi.object({
  name:        Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow('', null).optional(),
});

// GET /api/categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Book, as: 'books', attributes: ['id'] }],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories
router.post('/', auth, async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({
    message: 'Données invalides',
    errors: error.details.map(d => d.message),
  });
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ce nom de catégorie existe déjà' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', auth, async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({
    message: 'Données invalides',
    errors: error.details.map(d => d.message),
  });
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Catégorie introuvable' });
    await category.update(req.body);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Catégorie introuvable' });
    await category.destroy();
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
