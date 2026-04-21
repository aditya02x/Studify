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

// ✅ Better CORS (auto handles localhost + deployed)
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "http://localhost:3000",
  "https://studify-khaki.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API running locally 🚀");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/payment", paymentRoute); // fixed typo

// ✅ PORT
const PORT = process.env.PORT || 5000; // 👈 use 5000 for local

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error);
  }
};

startServer();