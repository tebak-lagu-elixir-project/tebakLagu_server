'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    players: DataTypes.JSON,
    songs: DataTypes.JSON
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};
