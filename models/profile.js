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
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Bio is Required'
        },
        notEmpty: {
          msg: 'Bio is Required'
        }
      }
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Photo is Required'
        },
        notEmpty: {
          msg: 'Photo is Required'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Phone is Required'
        },
        notEmpty: {
          msg: 'Phone is Required'
        }
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Birth Date is Required'
        },
        notEmpty: {
          msg: 'Birth Date is Required'
        },
        isGreaterThan(value) {
          const dob = new Date(value);
          const today = new Date();

          const age = today.getFullYear() - dob.getFullYear()

          if (age <= 18) {
            throw new Error("Age must be greater than 18")
          }
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};