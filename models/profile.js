'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get formatDate(){
      return this.birthDate.toISOString().split('T')[0]
    }

    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {foreignKey: "UserId"})
    }
  }
  Profile.init({
    bio: DataTypes.TEXT,
    photo: DataTypes.STRING,
    phone: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};