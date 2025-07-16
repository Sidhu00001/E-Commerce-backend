// ================== Imports ==================
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

// =============== Config & Environment =========
dotenv.config();
const connectDB = require("./config/db");

// =============== App Initialization ===========
const app = express();

// =============== Connect to DB ================
connectDB();

// =============== Middlewares ==================
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============== Cloudinary Config =============
cloudinary.v2.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

// =============== Routes ========================
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const orderRoute = require("./routes/orderRoutes");

app.use("/U1", userRoute);
app.use("/U2", productRoute);
app.use("/U3", categoryRoute);
app.use("/U4", orderRoute);

// =============== Root Route ====================
app.get("/", (req, res) => {
  res.send("Hello World!!!!");
});

// =============== Start Server ==================
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(
    ` Server is running on http://localhost:${port}`.bgMagenta.white
  );
});
