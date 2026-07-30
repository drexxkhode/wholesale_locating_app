const express = require("express");
const {
  login,
  getCompanyName,
  getMe,
  getDashboardDetails,
  getAllCompanyAdmins,
  getAllAdmins,
  updateUser,
  deleteAdminPhoto,
} = require("../controller/adminController");
const protect = require("../middleware/auth");
//const passwordResetRateLimit  = require("../../middleware/passwordResetRateLimit");
const {upload} =require('../middleware/upload');
const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/company-name", protect, getCompanyName);

//DISPLAY TO SUPER ADMINS
router.get("/dashboard", protect, getDashboardDetails);
router.get("/admins", protect, getAllAdmins);

//DISPLAY TO COMPANY ADMINS
router.get("/company-admins", protect, getAllCompanyAdmins);
router.put("/update/:id", protect, upload.single("photo"), updateUser);
router.delete("/admins/:id/photo", protect, deleteAdminPhoto);

/*router.post("/register",protect, upload.single('photo'), register);
router.delete("/delete/:id", protect, deleteUser); 
router.get("/details/:id", protect, getAdminDetails);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", passwordResetRateLimit , forgotPassword);
router.post("/reset-password", resetPassword);
router.delete('/:id/photo', protect,                         deleteAdminPhoto);*/

module.exports = router;
