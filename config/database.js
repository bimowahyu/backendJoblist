const Sequelize = require('sequelize')
const db = new Sequelize ('projectkp','root', '',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+07:00',

})

module.exports = db