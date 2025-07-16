const express = require("express");
const router = express.Router();
const {
  categoryCreateController,
  getAllCategoriesController,
  deleteCategoryController,
  updateCategoryController,
} = require("../Controllers/categorycontroller");
const authMiddleware = require("../Middlewares/authMiddleware");
const isAdmin = require("../Middlewares/isAdmin");
router.post("/create-category", isAdmin, categoryCreateController);
router.get("/get-all-categories", authMiddleware, getAllCategoriesController);
router.delete(
  "/delete-category/:id",
  isAdmin,
  authMiddleware,
  deleteCategoryController
);
router.put(
  "/update-category/:id",
  isAdmin,
  authMiddleware,
  updateCategoryController
);

module.exports = router;
