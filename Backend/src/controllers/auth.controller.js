
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req,res)=>{
    try {
        const {name, email ,password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({message:"All Credintials Are required"})
        
    }

    const existUser = await User.findOne({email})
    if(existUser){
        return res.status(400).json({message:"User Already Exist"})
    }

    const hashedpassword = await bcrypt.hash(password,10)

    const newUser = new User({
        name,
        email,
        password: hashedpassword,
        role:"instructor"
    })

    await newUser.save()
    res.status(201).json({message:"User Registered Successfully"})
    } catch (error) {
        console.log("Error in registerUser",error)
        res.status(500).json({message:"Internal Server Error"})
    }

}


export const LoginUser = async (req,res)=>{
    try {
        const {email ,password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"All Credintials Are required"})
        }

        const existUser = await User.findOne({email})
        if(!existUser){
            return res.status(400).json({message:"User Not Found"})
        }

        const isMatch = await bcrypt.compare(password, existUser.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }

      const token = jwt.sign(
  {
    _id: existUser._id,
    role: existUser.role
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

     

        res.status(200).json({message:"Login Successful",token,user:{
            id:existUser._id,
            name:existUser.name,
            email:existUser.email,
            role:existUser.role
        }})

    } catch (error) {
        console.log("Error in loginUser",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}