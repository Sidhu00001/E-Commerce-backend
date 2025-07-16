const express = require("express");
const router = express.Router();
const {
  userController,
  userLoginController,
  userProfileController,
  logoutController,
  updateUserProfileController,
  updateUserPasswordController,
  profilePicUploadController,
} = require("../Controllers/userController");
const authMiddleware = require("../Middlewares/authMiddleware");
const { singleUpload } = require("../Middlewares/multer");
router.post("/register", userController);
router.post("/login", userLoginController);
router.get("/profile", authMiddleware, userProfileController);
router.post("/logout", authMiddleware, logoutController);
router.put("/update", authMiddleware, updateUserProfileController);
router.put("/update-password", authMiddleware, updateUserPasswordController);
router.put(
  "/update-profile-pic",
  authMiddleware,
  singleUpload,
  profilePicUploadController
);

module.exports = router;
