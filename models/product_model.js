const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  availableOn: { type: [String], enum: ["amazon", "flipkart", "myntra"] },
  isBestDeal: { type: Boolean, default: false }, // New field for special offers
});

module.exports = mongoose.model("Product", productSchema);
