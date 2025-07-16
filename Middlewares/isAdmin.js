const { userModel } = require("../models/user.Model");
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admins only",
      });
    }
    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Authorization error",
      error: error.message,
    });
  }
};
module.exports = isAdmin;
