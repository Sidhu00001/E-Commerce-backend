const express = require("express");
const router = express.Router();
const {
  userOrder,
  getAllOrder,
  getSingleOrder,
  adminGetAllOrders,
  changeOrderStatus,
} = require("../Controllers/orderController");
const authMiddleware = require("../Middlewares/authMiddleware");
const isAdmin = require("../Middlewares/isAdmin");
router.post("/user-order", authMiddleware, userOrder);
router.get("/get-all-orders", authMiddleware, getAllOrder);
router.get("/get-single-order/:id", authMiddleware, getSingleOrder);
router.get(
  "/admin/get-all-orders/",
  authMiddleware,
  isAdmin,
  adminGetAllOrders
);
router.put(
  "/admin/order-status-updates/:id",
  authMiddleware,
  changeOrderStatus
);
module.exports = router;
