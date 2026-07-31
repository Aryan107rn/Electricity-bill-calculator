import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import billRoutes from "./routes/bills.js";
import stateRoutes from "./routes/states.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "⚡ Electricity Bill API is running", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/bills", billRoutes);
app.use("/api/states", stateRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n⚡ Electricity Bill Calculator API`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health\n`);
});
