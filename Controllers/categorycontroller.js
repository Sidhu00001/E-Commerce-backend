const express = require("express");
const { productModel } = require("../models/productModel");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/features");
const { categoryModel } = require("../models/categoryModel");
const categoryCreateController = async (req, res) => {
  try {
    const category = req.body;
    if (!category) {
      return res.status(400).json({
        message: "please fill all the fields",
      });
    }
    await categoryModel.create(category);
    res.status(201).json({
      message: "category created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "api is not working",
      error: err.message,
    });
  }
};
const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).json({
      message: "categories fetched successfully",
      categories: categories,
    });
  } catch (err) {
    res.status(500).json({
      message: "api is not working",
      error: err.message,
    });
  }
};
const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "category not found",
      });
    }
    const products = await productModel.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    await category.deleteOne();
    res.status(200).json({
      message: "category deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "api is not working",
      error: err.message,
    });
  }
};
const updateCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "category not found",
      });
    }
    const { updatedCategory } = req.body;
    if (!updatedCategory) {
      return res.status(400).json({
        message: "please fill all the fields",
      });
    }
    const products = await productModel.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }
    if (updatedCategory) {
      category.category = updatedCategory;
    }
    await category.save();
    res.status(200).json({
      message: "category updated successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "api is not working",
      error: err.message,
    });
  }
};
module.exports = {
  categoryCreateController,
  getAllCategoriesController,
  deleteCategoryController,
  updateCategoryController,
};
