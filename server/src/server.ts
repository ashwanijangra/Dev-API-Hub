import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import historyRoutes from "./routes/historyRoutes";
// Fix for MongoDB crypto issue

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use(
  "/api/collections",
  collectionRoutes
);
app.use("/api/history", historyRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("DevAPI Hub Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});