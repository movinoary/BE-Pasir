"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.belongsTo(models.user, {
        as: "create_by",
        foreignKey: {
          name: "createBy",
        },
      });
      transactions.hasMany(models.transaction_items, {
        as: "items",
        foreignKey: {
          name: "transactions_id",
        },
      });
    }
  }
  transactions.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      no_transaction: {
        type: DataTypes.STRING,
      },
      methods: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      total_price: {
        type: DataTypes.STRING,
      },
      information: {
        type: DataTypes.STRING,
      },
      explanation: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
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
      modelName: "transactions",
    }
  );
  return transactions;
};
