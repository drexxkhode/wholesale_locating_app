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

// GET /api/company/:id/images — public, anyone can view
router.get('/',                        getCompanyImages);

// POST /api/company/:id/images — admin only, upload up to 10 images at once
router.post('/', adminAuth, upload.array('images', 10), uploadCompanyImages);

// PUT /api/company/:id/images/:imageId/cover — admin only, set cover image
router.put('/:imageId/cover', adminAuth, setCompanyCover);

// DELETE /api/company/:id/images/:imageId — admin only, delete one image
router.delete('/:imageId', adminAuth, deleteCompanyImage);

// DELETE /api/company/:id/images — admin only, delete all images for this company
router.delete('/', adminAuth, deleteAllCompanyImages);



module.exports = router;
