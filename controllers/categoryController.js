import { Category, Book } from '../models/index.js';
import { categorySchema } from '../validations/categoryValidation.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Book, as: 'books', attributes: ['id'] }],
    });
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const createCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({
    message: 'Données invalides',
    errors: error.details.map(d => d.message),
  });
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ce nom de catégorie existe déjà' });
    }
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({
    message: 'Données invalides',
    errors: error.details.map(d => d.message),
  });
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Catégorie introuvable' });
    await category.update(req.body);
    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Catégorie introuvable' });
    await category.destroy();
    return res.status(200).json({ message: 'Catégorie supprimée' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
