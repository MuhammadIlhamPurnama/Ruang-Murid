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
      Course.hasMany(models.UserCourse, {foreignKey:'CourseId'})
      Course.belongsTo(models.User, {foreignKey: "TeacherId"})
    }

    static async getCourseById(id) {
      try {
        const course = await Course.findOne({
          where: { id },
          include: [
            { model: sequelize.models.Category },
            { model: sequelize.models.User, as: "User", foreignKey: "TeacherId" }, 
          ]
        });
        return course
      } catch (error) {
        throw error
      }
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