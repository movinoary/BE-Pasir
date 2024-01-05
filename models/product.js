"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.hasMany(models.product_variant, {
        as: "variant",
        foreignKey: {
          name: "product_id",
        },
      });
      product.hasOne(models.product_category, {
        as: "category",
        foreignKey: {
          name: "product_id",
        },
      });
      product.hasMany(models.product_price, {
        as: "list_price",
        foreignKey: {
          name: "product_id",
        },
      });
    }
  }
  product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
