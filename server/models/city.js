'use strict';
module.exports = (sequelize, DataTypes) => {
  var City = sequelize.define('City', {
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        City.hasMany(models.User);
      }
    }
  });
  return City;
};