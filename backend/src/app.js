import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import billRoutes from "./routes/bills.js";
import stateRoutes from "./routes/states.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean);

connectDB();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Electricity Bill API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/bills", billRoutes);
app.use("/api/states", stateRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

export default app;
