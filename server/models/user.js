'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    cityId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.City);
      }
    }
  });
  return User;
};