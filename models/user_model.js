const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name is required
  email: { type: String, required: true }, // Name is required
  phone: { type: Number, required: true }, // Phone is required
  likedProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // References the Product schema
        ref: "Product", // Name of the referenced model
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
