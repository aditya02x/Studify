import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./src/db/db.js";
import dotenv from "dotenv";
import lectureRoutes from "./src/routes/lecture.routes.js";
import authRoutes from "./src/routes/auth.route.js";
import courseRoutes from "./src/routes/course.route.js";

dotenv.config();

const app = express();

// ✅ CORS (supports Vercel + local dev + mobile)
const allowedOrigins = [
  "http://localhost:5173",
  "https://studify-khaki.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Welcome to Studify API");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);

// ✅ PORT
const PORT = process.env.PORT || 3000;

// ✅ Start server
const StartServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

StartServer();