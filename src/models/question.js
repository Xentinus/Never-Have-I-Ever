const { DataTypes } = require('sequelize');
const db = require('./index');
const Category = require('./category');

const Question = db.sequelize.define('Question', {
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
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Many-to-Many kapcsolat létrehozása
Question.belongsToMany(Category, { through: 'QuestionCategories' });
Category.belongsToMany(Question, { through: 'QuestionCategories' });

module.exports = Question;