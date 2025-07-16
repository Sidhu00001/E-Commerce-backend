const express = require("express");
const { userModel } = require("../models/user.Model");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../Middlewares/authMiddleware");
const getDataUri = require("../utils/features");
const datauriParser = require("datauri/parser");
const cloudinary = require("cloudinary");

const userController = async (req, res) => {
  try {
    const { ...data } = req.body;
    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.address ||
      !data.city ||
      !data.country ||
      !data.phone
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const user = await userModel.create(data);
    const { password, ...userWithoutPassword } = user._doc;
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    res.status(500).json({
      message: "api is not working",
      error: err.message,
    });
  }
};
// user login
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: "please provide email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid credentials",
      });
    }
    const token = user.generateToken();
    const { password: pwd, ...userWithoutPassword } = user._doc;
    res.status(200).send({
      message: "Login successful",
      user: userWithoutPassword,
      token: token,
    });
  } catch (err) {
    res.status(500).send({
      message: "Login failed",
      error: err.message,
    });
  }
};
//user profile
const userProfileController = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      user: req.user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Profile not found",
      error: err.message,
    });
  }
};
//logout
const logoutController = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};
//update user profile
const updateUserProfileController = async (req, res) => {
  try {
    // Use findByIdAndUpdate for an efficient and safe update
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user._id, // The ID of the user to update
        { $set: req.body }, // The fields to update from the request body
        {
          new: true, // Return the updated document, not the original
          runValidators: true, // Run schema validators on the updated fields
        }
      )
      .select("-password"); // Exclude the password from the returned user object

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    // Handle potential duplicate key error for email
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already in use." });
    }
    res.status(500).json({
      message: "Profile update failed",
      error: err.message,
    });
  }
};
//update user password
const updateUserPasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide old and new password" });
    }
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Password update failed",
      error: err.message,
    });
  }
};
const profilePicUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const user = await userModel.findById(req.user._id).select("profilePic");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const file = getDataUri(req.file);

    const cld = await cloudinary.v2.uploader.upload(file.content);

    await userModel.findByIdAndUpdate(req.user._id, {
      $set: {
        profilePic: {
          public_id: cld.public_id,
          url: cld.secure_url,
        },
      },
    });

    if (user.profilePic && user.profilePic.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    }

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Profile picture upload failed",
      error: err.message,
    });
  }
};
module.exports = {
  userController,
  userLoginController,
  userProfileController,
  logoutController,
  updateUserProfileController,
  updateUserPasswordController,
  profilePicUploadController,
};
