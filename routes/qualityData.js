const { Sequelize, Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const QualityDocument = require("../model/QualityDocument"); // Import your Sequelize model

router.post("/api/qualitydata", async (req, res) => {
  try {
    const { StartDate, EndDate, HeaderCode } = req.body;

    const aggregatedData = await QualityDocument.findAll({
      where: {
        HEADERCODE: HeaderCode,
        HEADERDATE: {
          [Sequelize.Op.between]: [StartDate, EndDate],
        },
      },
    });

    res.json({ success: true, data: aggregatedData });
  } catch (error) {
    console.error("Error fetching quality data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
