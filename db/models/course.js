'use strict'

const Sequelize = require('sequelize');
const User = require('./user.js');

module.exports = (sequelize) =>{
  const Course = sequelize.define('Course', {
  id:{
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  title:{
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty:{
        message: 'Please Provide a Title for the Course!'
      }
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty:{
        message: 'Please Provide a Description for the Course!'
      }
    }
  },
  estimatedTime:{
    type: Sequelize.STRING,
    allowNull: true
  },
  materialsNeeded:{
    type: Sequelize.STRING,
    allowNull: true
  },
}, { sequelize, modelName:'course' });

//Class Methods
Course.associate = (models) => {
    Course.belongsTo(models.User,
    {
      as: 'Creator',
      foreignKey: "userId"
    });

}
return Course;
}
