const { DataTypes } = require("sequelize");
const database = require("../database");

const OrderBookingMcmTable = database.define(
  "OrderBookingMcmTable",
  {
    COMPANYCODE: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    CONFIRMDATE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    CONFITMORDERQTY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    VALUE2: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    SOLDSMVMINUTE: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    VALUE1: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    VALUE7: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    PROJORDERQTY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SALESORDERCODE: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SUBCODE02: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "VIEWORDERBOOKINGBEXIMCO",
    timestamps: false,
  }
);
module.exports = { OrderBookingMcmTable };
