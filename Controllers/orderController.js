const express = require("express");
const { orderModel } = require("../models/orderModel");
const { productModel } = require("../models/productModel");
const { userModel } = require("../models/user.Model");
const { singleUpload } = require("../Middlewares/multer");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/features");
const userOrder = async (req, res) => {
  try {
    const { ...data } = req.body;
    if (
      !data.shippingInfo ||
      !data.orderItems ||
      !data.paymentMethod ||
      !data.user ||
      !data.paymentInfo ||
      !data.itemPrice ||
      !data.tax ||
      !data.shippingCharges ||
      !data.totalAmount ||
      !data.orderStatus
    ) {
      return res.status(400).send({
        message: "Please fill all the fields",
        status: false,
      });
    }


    const order = await orderModel.create(data);


    for (let i = 0; i < data.orderItems.length; i++) {
      const product = await productModel.findById(data.orderItems[i].product);

      if (!product) {
        return res.status(404).send({
          message: `Product with ID ${data.orderItems[i].product} not found`,
          status: false,
        });
      }

      if (product.stock < data.orderItems[i].quantity) {
        return res.status(400).send({
          message: `Insufficient stock for product: ${product.name}`,
          status: false,
        });
      }

      product.stock -= data.orderItems[i].quantity;
      await product.save();
    }

    res.status(201).send({
      message: "Order created successfully",
      status: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "API is not working",
      error: err.message,
    });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "no orders found",
      });
    }
    res.status(200).send({
      success: true,
      message: "all users fetched successfully",
      totalorders: orders.length,
      orders,
    });
  } catch (err) {
    res.status(500).send({
      message: "api is not working",
      error: err.message,
    });
  }
};
const getSingleOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "api is not working",
      });
    }
    res.status(200).send({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).send({
      success: flase,
      error: err.message,
    });
  }
};
const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    if (!orders || orders.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Server error while fetching orders",
      error: err.message,
    });
  }
};
const changeOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        message: "order not found",
        success: false,
      });
    }
    if (order.orderStatus === "PROCCESSING") {
      order.orderStatus = "SHIPPED";
    } else if (order.orderStatus === "SHIPPED") {
      order.orderStatus = "DELIVERED";
    } else {
      return res.status(500).send({
        message: "order already delivered",
        success: false,
      });
    }
    await order.save();
    res.status(200).send({
      message: "order status updated successfully",
      order,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  userOrder,
  getAllOrder,
  getSingleOrder,
  adminGetAllOrders,
  changeOrderStatus,
};
