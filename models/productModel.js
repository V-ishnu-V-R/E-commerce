const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  brand: String,
  name: String,
  price: Number,
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
  },

  sellingPrice: Number,
  imagepath: Array,
  stock: Number,
});
const Product = mongoose.model("Products", productSchema);
module.exports = Product;
