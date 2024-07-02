const { Sequelize, QueryTypes, Op } = require("sequelize");

const { OrderBookingMcmTable } = require("../models/ObrMcmYearly");
const database = require("../database");

exports.GET_ORDER_BOOKING_MCM = async (req, res) => {
  try {
    const { StartDate, EndDate } = req.body;

    // Find records matching the specified Month and Year
    const filteredData = await OrderBookingMcmTable.findAll({
      attributes: [
        "SALESORDERCODE",
        "SUBCODE02",
        [
          Sequelize.fn("SUM", Sequelize.col("CONFITMORDERQTY")),
          "totalCONFITMORDERQTY",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("PROJORDERQTY")),
          "totalPROJORDERQTY",
        ],
        [Sequelize.fn("SUM", Sequelize.col("SOLDSMVMINUTE")), "totalMINUTE"],
        [Sequelize.fn("MAX", Sequelize.col("VALUE1")), "EFF"],
        [Sequelize.fn("MAX", Sequelize.col("VALUE2")), "SMV"],
        [Sequelize.fn("MAX", Sequelize.col("VALUE7")), "MANPOWER"],
      ],
      where: {
        CONFIRMDATE: {
          [database.Sequelize.Op.between]: [StartDate, EndDate],
        },
      },
      group: ["SALESORDERCODE", "SUBCODE02"], // Group by SALESORDERCODE AND SUBCODE02
    });

    // Initialize accumulators for category sums
    const categorySums = {};

    // Process the filtered data to calculate sums dynamically
    filteredData.forEach((item) => {
      const subcode = item.getDataValue("SUBCODE02").trim();
      const totalCONFITMORDERQTY = item.getDataValue("totalCONFITMORDERQTY");
      const totalPROJORDERQTY = item.getDataValue("totalPROJORDERQTY");
      const SMV = item.getDataValue("SMV");
      const EFF = item.getDataValue("EFF");

      // Calculate A and B for each category
      const A = totalCONFITMORDERQTY * SMV * EFF;
      const B = totalPROJORDERQTY * SMV * EFF;

      if (!categorySums[subcode]) {
        categorySums[subcode] = { confirmOrder: A, projectionOrder: B };
      }
    });

    res.json({ success: true, categorySums });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
