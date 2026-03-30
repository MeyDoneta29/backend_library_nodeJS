import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Book = sequelize.define('Book', {
  id:                 { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:              { type: DataTypes.STRING, allowNull: false },
  author:             { type: DataTypes.STRING, allowNull: false },
  isbn:               { type: DataTypes.STRING, unique: true, allowNull: true },
  category_id:        {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Categories', key: 'id' },
  },
  description:        { type: DataTypes.TEXT, allowNull: true },
  quantity:           { type: DataTypes.INTEGER, defaultValue: 1 },
  available_quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  cover_image:        { type: DataTypes.STRING, allowNull: true },
});

export default Book;
