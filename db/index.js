'use strict'
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db'
});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.User= require('./models/user.js')(sequelize);
db.models.Course= require('./models/course.js')(sequelize);


// Import all of the models.
fs
  .readdirSync(path.join(__dirname, 'models'))
  .forEach((file) => {
    console.info(`Importing database model from file: ${file}`);
    const model = sequelize.import(path.join(__dirname, 'models', file));
    db.models[model.name] = model;
  });

// If available, call method to create associations.
Object.keys(db.models).forEach((modelName) => {
  if (db.models[modelName].associate) {
    console.info(`Configuring the associations for the ${modelName} model...`);
    db.models[modelName].associate(db.models);
  }
});

module.exports = db;
