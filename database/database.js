const Sequelize = require('sequelize');
const connection = new Sequelize('theblog','root','13509', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;