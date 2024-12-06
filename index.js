const express = require("express");
const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const MONGO_URI = process.env.MONGO_URI;
// const PORT = process.env.PORT || 3300;

// app.use(cors());

// // JSON middleware for Express
// app.use(express.json());

// // Set strictQuery to avoid warnings
// mongoose.set("strictQuery", true);

// // MongoDB Connection
// mongoose
//   .connect(MONGO_URI, {
//     serverSelectionTimeoutMS: 15000, // 15 seconds
//   })
//   .then(() => console.log("Successfully connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Include models and routes
// require("./models/user_model");
// require("./models/product_model");
// app.use(require("./routes/user_route"));
// // app.use(require("./routes/user_related_route"));
// app.use(require("./routes/product_route"));

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is working nov-16 4pm");
});

// Start Express server
// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });
