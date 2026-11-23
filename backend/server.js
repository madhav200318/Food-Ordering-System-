require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const foodRoutes = require("./routes/foods");
const orderRoutes = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/food_ordering";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected:", MONGO_URI);
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
