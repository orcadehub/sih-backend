const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.model("Product");
const User = mongoose.model("User");

// Add a product
router.post("/products", async (req, res) => {
  try {
    const { productId, name, price, description, category, image } = req.body;

    const newProduct = new Product({ productId, name, price, description, category, image });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(400).json({ error: "Failed to add product", details: error.message });
  }
});


// Register a user
router.post("/users", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email or phone already exists" });
    }

    const newUser = new User({ name, email, phone, likedProducts: [] });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: "Failed to register user", details: error.message });
  }
});

// Fetch a user by email or phone
router.get("/users", async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone is required to fetch user" });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Fetch liked products of a user
router.get("/users/:id/liked-products", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("likedProducts.productId");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.likedProducts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch liked products" });
  }
});

// Add a liked product to a user
router.post("/users/:id/like-product", async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const alreadyLiked = user.likedProducts.some(
      (liked) => liked.productId.toString() === productId
    );

    if (alreadyLiked) {
      return res.status(400).json({ error: "Product is already liked by the user" });
    }

    user.likedProducts.push({ productId });
    await user.save();
    res.status(200).json({ message: "Product added to liked products" });
  } catch (error) {
    res.status(400).json({ error: "Failed to like product", details: error.message });
  }
});

// Delete a liked product from a user
router.delete("/users/:id/liked-product/:productId", async (req, res) => {
    try {
      const { id, productId } = req.params;
  
      // Find the user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the product exists in likedProducts
      const productIndex = user.likedProducts.findIndex(
        (liked) => liked.productId.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in liked products" });
      }
  
      // Remove the product from likedProducts
      user.likedProducts.splice(productIndex, 1);
      await user.save();
  
      res.status(200).json({ message: "Product removed from liked products", likedProducts: user.likedProducts });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete liked product", details: error.message });
    }
  });
  

module.exports = router;
