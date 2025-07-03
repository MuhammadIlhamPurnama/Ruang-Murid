'use strict';
const hashPassword = require('../helpers/helper')
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {foreignKey: "UserId"})
      User.hasMany(models.UserCourse, {foreignKey: "UserId"})
      User.hasMany(models.Course, {foreignKey: "TeacherId"})
    }
  }
  User.init({
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name Required!"
        },
        notEmpty: {
          msg: "Name required"
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email Required!"
        },
        notEmpty: {
          msg: "Email required"
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password Required!"
        },
        notEmpty: {
          msg: "Password required"
        }
      }
    },
    role: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Role Required!"
        },
        notEmpty: {
          msg: "Role required"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        hashPassword(user)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};