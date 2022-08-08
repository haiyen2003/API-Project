'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(models.Image, {foreignKey: 'reviewId'});
      Review.belongsTo(models.User, {foreignKey: 'userId'});
      Review.belongsTo(models.Spot, {foreignKey: 'spotId'})
    }
  }
  Review.init({
    review: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
        max: 5
      }
    },
    userId: {
      type: DataTypes.INTEGER,
     // allowNull: false,
     // references: {model: 'Users'}
    },
    spotId: {
      type: DataTypes.INTEGER,
      //allowNull: false,
      //references: {model: 'Spots'}
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
