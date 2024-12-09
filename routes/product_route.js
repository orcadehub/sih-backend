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
    res
      .status(201)
      .json({
        message: "Products added successfully",
        products: addedProducts,
      });
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
    res.status(200).json({ products: result.map((item) => item.item) });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while searching for products." });
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
      return res.status(200).json(result.map((item) => item.item));
    }

    // If no search query, return all products
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
});

// Fetch best deals (products marked with 'isBestDeal: true')
router.get("/products/best-deals", async (req, res) => {
  try {
    const bestDeals = await Product.find({ isBestDeal: true });
    res.status(200).json({ products: bestDeals });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch best deals." });
  }
});

// Helper function to generate a random list of platforms
const getRandomPlatforms = () => {
  const platforms = ["amazon", "flipkart", "myntra"];
  const randomPlatforms = [];
  const randomCount = Math.floor(Math.random() * 3) + 1; // Randomly choose 1, 2, or 3 platforms

  // Randomly pick platforms
  while (randomPlatforms.length < randomCount) {
    const randomPlatform =
      platforms[Math.floor(Math.random() * platforms.length)];
    if (!randomPlatforms.includes(randomPlatform)) {
      randomPlatforms.push(randomPlatform);
    }
  }

  return randomPlatforms;
};

// API to update the 'availableOn' field for all products
router.post("/updateavailableon", async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Update the 'availableOn' field for each product
    const updatedProducts = [];
    for (const product of products) {
      const randomPlatforms = getRandomPlatforms();

      // Update the 'availableOn' field of the current product
      const updatedProduct = await Product.findByIdAndUpdate(
        product._id,
        { $set: { availableOn: randomPlatforms } },
        { new: true } // Return the updated document
      );

      if (updatedProduct) {
        updatedProducts.push(updatedProduct);
      }
    }

    // Return the updated products
    res.status(200).json({
      message: "All products updated successfully.",
      updatedProducts,
    });
  } catch (err) {
    console.error("Error updating products:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating products." });
  }
});

module.exports = router;
