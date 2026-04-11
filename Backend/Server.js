import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./src/db/db.js";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.route.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to Studify API")
})

app.use('/api/auth',authRoutes)

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