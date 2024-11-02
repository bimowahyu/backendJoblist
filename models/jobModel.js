const { sequelize, DataTypes } = require('sequelize');
const db = require('../config/database.js');
const Users = require('./userModel.js');

const Job = db.define('job', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    job: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    userUuid: {
        type: DataTypes.UUID,
        references: {
            model: Users,
            key: 'uuid'
        },
        allowNull: false
    }
}, {
    freezeTableName: true
});


Job.belongsTo(Users, { foreignKey: 'userUuid' });

module.exports = Job;
