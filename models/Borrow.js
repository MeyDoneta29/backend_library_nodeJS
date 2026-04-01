import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Member from './Member.js';
import Book from './Book.js';

const Borrow = sequelize.define('Borrow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Member,
      key: 'id'
    }
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id'
    }
  },
  borrow_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  return_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
    defaultValue: 'borrowed'
  }
}, {
  timestamps: true
});

// Associations
Borrow.belongsTo(Member, { foreignKey: 'member_id', as: 'member' });
Borrow.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });

export default Borrow;