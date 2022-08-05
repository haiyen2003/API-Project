'use strict';
const {
  Model
} = require('sequelize');
const spot = require('./spot');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Spot, {foreignKey: 'spotId'});
      Image.belongsTo(models.Review, {foreignKey: 'reviewId'});
      Image.belongsTo(models.User, {foreignKey: 'userId'});
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING
    },
    previewImage: {
      type: DataTypes.BOOLEAN
    },
    spotId: {
      type: DataTypes.INTEGER,
     // allowNull: false
    },
    reviewId: {
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
     // allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
