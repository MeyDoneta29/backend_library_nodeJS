import sequelize from '../config/database.js';
import User from './User.js';
import Category from './Category.js';
import Book from './Book.js';
import Member from './Member.js';
import Borrow from './Borrow.js';
// Borrow ajouté lors de feat/integration

Category.hasMany(Book, { foreignKey: 'category_id', as: 'books' });
Book.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export { sequelize, User, Category, Book, Member, Borrow };
