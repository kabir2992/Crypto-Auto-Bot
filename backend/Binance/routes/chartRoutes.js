const express = require('express');
const router = express.Router();

const { getChartData } = require("../controllers/chartController");

router.get("/", getChartData);

module.exports = router;