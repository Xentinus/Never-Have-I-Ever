const { DataTypes } = require('sequelize');
const db = require('./index');

const Category = db.sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deletedFl: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Category;