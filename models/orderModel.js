const mongoose = require("mongoose");
const schema = mongoose.Schema;
const orderSchema = new schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, "name is required"],
      },
      price: {
        type: Number,
        required: [true, "price is required"],
      },
      quantity: {
        type: Number,
        required: [true, "quantity is required"],
      },
      image: {
        type: String,
        required: [true, "image is requried"],
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: [true, "product is required"],
      },
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    default: "COD",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    requried: [true, "user is required"],
  },
  paidAt: Date,
  paymentInfo: {
    id: String,
    status: String,
  },
  itemPrice: {
    type: Number,
    required: [true, "item is required"],
  },
  tax: {
    type: Number,
    required: [true, "tax is required"],
  },
  shippingCharges: {
    type: Number,
    required: [true, "shipping charges is required"],
  },
  totalAmount: {
    type: Number,
    required: [true, "total amount is required"],
  },
  orderStatus: {
    type: String,
    enum: ["PROCCESSING", "SHIPPED", "DELIVERED"],
    default: "PROCESSING",
  },
  deliveredAt: Date,
});
const orderModel = mongoose.model("orders", orderSchema);
module.exports = { orderModel };
