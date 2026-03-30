import sequelize from '../config/database.js';
import User from './User.js';
import Category from './Category.js';
import Book from './Book.js';
// Member et Borrow ajoutés lors de feat/integration

Category.hasMany(Book, { foreignKey: 'category_id', as: 'books' });
Book.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export { sequelize, User, Category, Book };
