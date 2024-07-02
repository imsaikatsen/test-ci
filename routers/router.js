const express = require("express");
const router = express.Router();

const { GET_ORDER_BOOKING_MCM } = require("../controllers/OrderBookingMcm");

router.post("/get-order-booking-mcm", GET_ORDER_BOOKING_MCM);

//.................... END ........................//

module.exports = router;
