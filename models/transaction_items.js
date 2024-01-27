"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction_items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction_items.belongsTo(models.product, {
        as: "product",
        foreignKey: {
          name: "product_id",
        },
      });
      transaction_items.belongsTo(models.product_variant, {
        as: "variant",
        foreignKey: {
          name: "variant_id",
        },
      });
      transaction_items.belongsTo(models.product_price, {
        as: "prices",
        foreignKey: {
          name: "price_id",
        },
      });
      transaction_items.belongsTo(models.transactions, {
        as: "transaction",
        foreignKey: {
          name: "transactions_id",
        },
      });
    }
  }
  transaction_items.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      transactions_id: {
        type: DataTypes.STRING,
        type: DataTypes.UUID,
        references: {
          model: "transactions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: DataTypes.STRING,
        type: DataTypes.UUID,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      variant_id: {
        type: DataTypes.STRING,
        type: DataTypes.UUID,
        references: {
          model: "product_variants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      price_id: {
        type: DataTypes.STRING,
        type: DataTypes.UUID,
        references: {
          model: "product_prices",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        type: DataTypes.INTEGER(5),
      },
      price: {
        type: DataTypes.INTEGER(15),
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
      modelName: "transaction_items",
    }
  );
  return transaction_items;
};
