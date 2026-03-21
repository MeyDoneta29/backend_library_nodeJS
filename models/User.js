import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true // Validation pour s'assurer que c'est un email valide
      }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'users',
    timestamps: true,
}
);

export default User;