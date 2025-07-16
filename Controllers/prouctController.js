const express = require("express");
const { productModel } = require("../models/productModel");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/features");
const GetAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).send({
      message: "products fetched successfully",
      success: true,
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching products",
      error: err.message,
    });
  }
};
const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        message: "product Not found ",
        status: false,
      });
    }
    res.status(200).send({
      message: "product fetched succesfully",
      status: true,
      product: product,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching products",
      error: err.message,
    });
  }
};
const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).send({
        message: "Please fill all the fields",
        status: false,
      });
    }
    if (!req.file) {
      return res.status(400).send({
        message: "Please upload an image",
        status: false,
      });
    }

    const file = getDataUri(req.file);
    const cld = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cld.public_id,
      url: cld.secure_url,
    };

    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      image: [image],
    });
    res.status(201).send({
      message: "product created successfully",
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error creating product",
      error: err.message,
    });
  }
};
const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        message: "product not found",
        status: false,
      });
    }
    const { name, description, price, stock, category } = req.body;
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (stock) {
      product.stock = stock;
    }
    if (category) {
      product.category = category;
    }
    await product.save();
    res.status(200).send({
      message: "product updated successfully",
      status: true,
      product: product,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).send({
      message: "Error updating product",
      error: err.message,
    });
  }
};
const updateProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        message: "product not found",
        status: false,
      });
    }
    if (!req.file) {
      return res.status(400).send({
        message: "Please upload an image",
        status: false,
      });
    }
    const file = getDataUri(req.file);
    const cld = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cld.public_id,
      url: cld.secure_url,
    };
    product.image.push(image);
    await product.save();
    res.status(200).send({
      message: "product image updated successfully",
      status: true,
      product: product,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating product image",
      error: err.message,
    });
  }
};
const deleteImageController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { public_id } = req.query;

    // Validate input
    if (!public_id) {
      return res.status(400).json({
        message: "Please provide public_id in query parameter",
        status: false,
      });
    }

    // Fetch product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        status: false,
      });
    }

    // Find image by public_id
    const imageIndex = product.image.findIndex(
      (img) => img.public_id === public_id
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        message: "Image not found in product",
        status: false,
      });
    }

    // Delete from Cloudinary
    await cloudinary.v2.uploader.destroy(public_id);

    // Remove from product images array
    product.image.splice(imageIndex, 1);
    await product.save();

    return res.status(200).json({
      message: "Product image deleted successfully",
      status: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting product image",
      error: err.message,
    });
  }
};
const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        message: "product not found",
        status: false,
      });
    }
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.v2.uploader.destroy(product.image[i].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      message: "product deleted successfully",
      status: true,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).send({
      message: "Error updating product",
      error: err.message,
    });
  }
};

module.exports = {
  GetAllProductsController,
  getSingleProductController,
  createProductController,
  updateProductController,
  updateProductImageController,
  deleteImageController,
  deleteProductController,
};
