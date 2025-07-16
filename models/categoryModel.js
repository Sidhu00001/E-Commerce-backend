const mongoose = require("mongoose");
const schema = mongoose.Schema;
const categorySchema = new schema({
  category: {
    type: String,
    required: [true, "category is required"],
  },
});
const categoryModel = mongoose.model("Category", categorySchema);
module.exports = { categoryModel };
