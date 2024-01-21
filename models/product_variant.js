"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product_variant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product_variant.init(
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
      stockTotal: {
        type: DataTypes.INTEGER(15),
      },
      stock: {
        type: DataTypes.INTEGER(15),
      },
      stockOut: {
        type: DataTypes.INTEGER(15),
      },
      stockSelling: {
        type: DataTypes.INTEGER(15),
      },
      stockReject: {
        type: DataTypes.INTEGER(15),
      },
      product_id: {
        type: DataTypes.UUID,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: "product_variant",
    }
  );
  return product_variant;
};
