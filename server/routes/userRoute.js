const express = require("express");

const {
  register,
  login,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword
} = require("../controller/userController");

const { upload }               = require('../middleware/upload');
const { uploadProfilePhoto,
        deleteProfilePhoto }   = require('../controller/userPhotoController');


const protect = require("../middleware/auth");

const router = express.Router();

/* AUTH ROUTES */

router.post("/register", register);
router.post("/login", login);

/* USER ROUTES */

router.put("/update-user/:id", protect, updateUser);
router.put("/change-password/:id", protect, changePassword);

// Upload profile photo — single file, field name must be 'photo'
router.put('/profile/photo',  protect, upload.single('photo'), uploadProfilePhoto);

// Remove profile photo
router.delete('/profile/photo', protect, deleteProfilePhoto);

/* PASSWORD RESET */

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;