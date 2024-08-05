'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    class: DataTypes.STRING,
    description: DataTypes.STRING,
    price:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Products',
  });
  Products.associate = function (models) {
    Products.hasMany(models.Cart,{foreignKey:'ProductId'})
  }
  return Products;
};