const express = require("express");
const router = express.Router();

const { login, getMe, getAllCompanies, getCompanyDetail, help } = require("../controller/userController");
const { getCategories } = require("../controller/companyController");
const { getMapCompanies } = require("../controller/mapController");
const protect = require("../middleware/user");
const checkMaintenance = require("../middleware/checkMaintenance");

router.post("/login", login);
router.get("/me", protect, checkMaintenance, getMe);

router.get("/categories",  getCategories);
router.get("/companies",  getAllCompanies);
router.get("/companies/:id",  getCompanyDetail);
router.get("/company-detail/:id",  getCompanyDetail);
router.get("/map",  getMapCompanies);

router.get("/about", (_req, res) => {
  res.json({
    description:
      "This platform helps you discover and navigate wholesale companies in the North Industrial Area, Accra.",
  });
});

router.post("/contact", (_req, res) => {
  res.json({ message: "Contact form received" });
});
router.post("/help", help);

module.exports = router;
