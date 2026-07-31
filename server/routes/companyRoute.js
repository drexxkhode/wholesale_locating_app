const express = require("express");
const router  = express.Router({ mergeParams: true }); // mergeParams to access :id from parent

const protect = require("../middleware/auth");
//const passwordResetRateLimit  = require("../../middleware/passwordResetRateLimit");
const {upload} =require('../middleware/upload');
const {
 getCompanyImages,
  uploadCompanyImages,
  setCompanyCover,
  deleteCompanyImage,
  deleteAllCompanyImages,
} = require('../controller/imageController');


const {
  addCategory,
  updateCategory,
  deleteCategory,
  addCompany,
  updateCompany,
  deleteCompany,
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts
} = require("../controller/companyController");

router.post("/categories", protect, addCategory);
router.put("/categories/:id", protect, updateCategory);
router.delete("/categories/:id", protect, deleteCategory);

router.post("/companies", protect, addCompany);
router.put("/companies/:id", protect, updateCompany);
router.delete("/companies/:id", protect, deleteCompany);

router.post("/new-product", protect, addProduct);
router.get("/products/:company_id", protect, getProducts);
router.put("/products/:id", protect, updateProduct);
router.delete("/products/:id", protect, deleteProduct);



module.exports = router;
