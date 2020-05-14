'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let { name, players, songs } = require('./seed.js')
    players = JSON.stringify(players)
    songs = JSON.stringify(songs)
    return queryInterface.bulkInsert('Rooms', [{
      name, players, songs,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Rooms', null, {});
  }
};
