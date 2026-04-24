import express from "express";
import cors from "cors";
import { connectDB } from "./src/db/db.js";
import dotenv from "dotenv";

import lectureRoutes from "./src/routes/lecture.routes.js";
import authRoutes from "./src/routes/auth.route.js";
import courseRoutes from "./src/routes/course.route.js";
import paymentRoute from "./src/routes/payement.route.js";

dotenv.config();

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://studify-khaki.vercel.app"
];

// ✅ CORS (production-safe)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed: " + origin));
      }
    },
    credentials: true
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Debug logger
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ✅ Health check (KEEP THIS ABOVE ROUTES)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy 🚀"
  });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ Routes
app.use("/", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/payment", paymentRoute);

// ❌ 404 (ALWAYS LAST)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    message: err.message || "Server error"
  });
});

// ✅ PORT
const PORT = process.env.PORT || 5000;

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed:", error);
    process.exit(1);
  }
};

startServer();