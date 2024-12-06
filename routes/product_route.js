const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.model("Product");
// const User = mongoose.model("User");
const Fuse = require("fuse.js");

router.post("/products/bulk", async (req, res) => {
    try {
      const { products } = req.body;
    //   console.log(products)
  
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Invalid product data provided." });
      }
  
      const addedProducts = await Product.insertMany(products);
      res.status(201).json({ message: "Products added successfully", products: addedProducts });
    } catch (error) {
      console.error("Error adding multiple products:", error);
      res.status(500).json({ error: "Failed to add products" });
    }
  });


  // Search products API with fuzzy matching
router.get("/search", async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }
  
    try {
      // Fetch all products (could be optimized by limiting the number of products returned)
      const products = await Product.find();
  
      // Set up Fuse.js options for fuzzy searching
      const fuseOptions = {
        keys: ["name", "category"], // Fields to search in
        threshold: 0.4, // Define how "fuzzy" the search is (lower = more exact)
      };
  
      const fuse = new Fuse(products, fuseOptions);
      const result = fuse.search(query); // Perform the search
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No items found." });
      }
  
      // Return matched products
      res.status(200).json({ products: result.map(item => item.item) });
    } catch (err) {
      res.status(500).json({ error: "An error occurred while searching for products." });
    }
  });

router.get("/products", async (req, res) => {
  const { search } = req.query;

  try {
    // Fetch all products from the database
    const products = await Product.find();

    // If search is provided, use Fuse.js to filter products
    if (search) {
      // Set up Fuse.js options for fuzzy searching
      const fuseOptions = {
        keys: ["name", "category"], // Fields to search in
        threshold: 0.4, // Define how "fuzzy" the search is (lower = more exact)
      };

      // Initialize Fuse.js with products data
      const fuse = new Fuse(products, fuseOptions);
      const result = fuse.search(search); // Perform the search with fuzzy matching

      // Return matched products
      return res.status(200).json(result.map(item => item.item));
    }

    // If no search query, return all products
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching products." });
  }
});

  
module.exports = router;