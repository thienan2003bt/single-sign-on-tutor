'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Group, { foreignKey: 'groupId' });
      User.belongsToMany(models.Project, { through: 'Project_User' });
    }
  };

  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    type: {
      type: DataTypes.STRING,
      defaultValue: 'LOCAL',
    },
    address: DataTypes.STRING,
    sex: DataTypes.STRING,
    phone: DataTypes.STRING,
    groupId: DataTypes.INTEGER,
    refreshToken: DataTypes.STRING,
    OTPCode: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};