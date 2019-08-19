'use strict'

const Sequelize = require('sequelize');
const Course = require('./course.js');

module.exports = (sequelize) => {
const User = sequelize.define('User', {
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty:{
        message: 'Please Provide a First Name!'
      }
      }
    },
  lastName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty:{
        message: 'Please Provide a Last Name!'
      }
      }
    },
  emailAddress: {
    type: Sequelize.STRING,
    validate: {
      notEmpty:{
        message: 'Please Provide a Valid Email Address!'
      }
      }
    },
  password: {
    type: Sequelize.STRING,
    validate: {
      notEmpty:{
        message: 'Please Provide a Valid Password!'
      }
    }
  },

}, {sequelize});


User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'Creator',
      foreignKey: "userId"
    });
}
return User;
}
