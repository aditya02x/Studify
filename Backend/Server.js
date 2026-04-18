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
app.use(cors({
      origin: "https://studify-khaki.vercel.app",
  credentials: true
}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to Studify API")
})

app.use('/api/auth',authRoutes)
app.use('/api/courses',courseRoutes)
app.use('/api/lectures', lectureRoutes)
 // Add this line to include user routes

const PORT = process.env.PORT || 3000;

const StartServer = async ()=>{
    try {
        await connectDB();

        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`)
        })
        
    } catch (error) {

       console.error("Error starting the server",error) 
    }
    
}

StartServer()