const express = require("express");
const router = express.Router();
const {
  GetAllProductsController,
  getSingleProductController,
  createProductController,
  updateProductController,
  updateProductImageController,
  deleteImageController,
  deleteProductController,
} = require("../Controllers/prouctController");
const authMiddleware = require("../Middlewares/authMiddleware");
const isAdmin = require("../Middlewares/isAdmin");
const { singleUpload } = require("../Middlewares/multer");
router.get("/get-all-products", GetAllProductsController);
router.get("/get-single-product/:id", getSingleProductController);
router.post(
  "/create-product",
  isAdmin,
  authMiddleware,
  singleUpload,
  createProductController
);
router.put(
  "/update-product/:id",
  isAdmin,
  authMiddleware,
  updateProductController
);
router.put(
  "/update-product-image/:id",
  isAdmin,
  authMiddleware,
  singleUpload,
  updateProductImageController
);
router.delete(
  "/delete-product-image/:productId",
  isAdmin,
  authMiddleware,
  deleteImageController
);
router.delete(
  "/delete-product/:id",
  isAdmin,
  authMiddleware,
  deleteProductController
);
module.exports = router;
