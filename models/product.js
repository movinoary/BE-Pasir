"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.belongsTo(models.user, {
        as: "createby",
        foreignKey: {
          name: "createBy",
        },
      });
      product.belongsTo(models.user, {
        as: "updateby",
        foreignKey: {
          name: "updateBy",
        },
      });
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
      product.belongsTo(models.brands, {
        as: "brand",
        foreignKey: {
          name: "brand_id",
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
      brand_id: {
        type: DataTypes.UUID,
        references: {
          model: "brands",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createBy: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      updateBy: {
        type: DataTypes.UUID,
        references: {
          model: "users",
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
      modelName: "product",
    }
  );
  return product;
};
