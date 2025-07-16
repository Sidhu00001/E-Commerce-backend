const mongoose = require("mongoose");
const schema = mongoose.Schema;
const productSchema = new schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  stock: {
    type: Number,
    required: [true, "stock is required"],
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: {
    type: Array,
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});
const productModel = mongoose.model("products", productSchema);
module.exports = { productModel };
