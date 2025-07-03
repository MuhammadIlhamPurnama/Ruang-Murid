'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category, {foreignKey: "CategoryId"})
      Course.belongsToMany(models.User, {through: models.UserCourse, foreignKey:'CourseId'})
      Course.belongsTo(models.User, {foreignKey: "TeacherId"})
    }
  }
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    CategoryId: DataTypes.INTEGER,
    TeacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};