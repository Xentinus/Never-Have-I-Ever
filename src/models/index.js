const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  dialectOptions: {
    charset: 'utf8'
  }
});

const db = {};
db.sequelize = sequelize;

module.exports = db;