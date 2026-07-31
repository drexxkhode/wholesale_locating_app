const express = require("express"); 
const {
  login,
  getCompanyName,
  getMe,
  getDashboardDetails,
  getAllCompanyAdmins,
  getAllCompanies,
  getMyCompanyDetails,
  getAllAdmins,
  updateUser,
  deleteAdminPhoto,
  changePassword
} = require("../controller/adminController");
const protect = require("../middleware/auth");
//const passwordResetRateLimit  = require("../../middleware/passwordResetRateLimit");
const {upload} =require('../middleware/upload');
const router  = express.Router(); // mergeParams to access :id from parent

//GENERAL
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/company-name", protect, getCompanyName);

//DISPLAY TO SUPER ADMINS
router.get("/dashboard", protect, getDashboardDetails);
router.get("/admins", protect, getAllAdmins);
router.get("/companies", protect, getAllCompanies);

//DISPLAY TO COMPANY ADMINS
router.get("/company-admins", protect, getAllCompanyAdmins);
router.put("/update/:id", protect, upload.single("photo"), updateUser);
router.delete("/admins/:id/photo", protect, deleteAdminPhoto);
router.get("/mycompany/:company_id", protect,  getMyCompanyDetails)
router.put("/change-password/:id", protect, changePassword);

/*router.post("/register",protect, upload.single('photo'), register);
router.delete("/delete/:id", protect, deleteUser); 
router.get("/details/:id", protect, getAdminDetails);

router.post("/forgot-password", passwordResetRateLimit , forgotPassword);
router.post("/reset-password", resetPassword);
router.delete('/:id/photo', protect,                         deleteAdminPhoto);*/

module.exports = router;
