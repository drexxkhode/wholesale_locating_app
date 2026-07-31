const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { getMapCompanies } = require("../controller/mapController");

router.get("/companies", protect, getMapCompanies);

module.exports = router;
