const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { 
    getSystemDetails,
    addSystemDetails,
    updateSystemDetails,
    getDatabaseSize
 } = require("../controller/systemController");
 const {upload} = require("../middleware/upload");

router.get("/system-details", protect, getSystemDetails);
router.get("/database-size",  getDatabaseSize);
router.post("/system-details", protect, addSystemDetails);

router.put("/system-details/:id", protect, upload.single("system_photo") ,updateSystemDetails);

module.exports = router;
