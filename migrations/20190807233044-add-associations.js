'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => return queryInterface.addColumn(
      'Course', // name of Source model
      'userId', // name of the key we're adding
      {
        type: Sequelize.UUID,
        references: {
          model: 'User', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Course', // name of Source model
      'UserId' // key we want to remove
    );
  }
};
