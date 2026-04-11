import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./src/db/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Welcome to Studify API")
})

const PORT = process.env.PORT || 3000;

const StartServer = async ()=>{
    try {
        await connectDB();
        console.log("Connected to MongoDB")
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`)
        })
        
    } catch (error) {

        
    }
    
}

StartServer()