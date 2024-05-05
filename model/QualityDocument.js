const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const QualityDocument = sequelize.define(
  "QualityDocument",
  {
    HEADERDATE: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    HEADERCODE: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    SUBCODE02: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "QUALITYDOCUMENT",
    timestamps: false,
  }
);

module.exports = QualityDocument;
