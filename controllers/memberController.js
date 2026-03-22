import Member from '../models/Member.js';
import { memberSchema } from '../validations/memberValidation.js';
import { Op } from 'sequelize';


export const getMembers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows: members } = await Member.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      members
    });

  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


export const createMember = async (req, res) => {
  try {
    const { error } = memberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { first_name, last_name, email, phone, address, status } = req.body;

    // Vérifier si l'email existe déjà
    if (email) {
      const existing = await Member.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }

    const member = await Member.create({
      first_name,
      last_name,
      email,
      phone,
      address,
      status
    });

    return res.status(201).json({
      message: 'Membre créé avec succès',
      member
    });

  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


export const updateMember = async (req, res) => {
  try {
    const { error } = memberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }

    await member.update(req.body);

    return res.status(200).json({
      message: 'Membre mis à jour avec succès',
      member
    });

  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Membre non trouvé' });
    }

    await member.destroy();

    return res.status(200).json({ message: 'Membre supprimé avec succès' });

  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};