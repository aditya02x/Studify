import User from "../models/UserModel.js";

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

    const newUser = new User({
        name,
        email,
        password,
        role:"student"
    })

    await newUser.save()
    res.status(201).json({message:"User Registered Successfully"})
    } catch (error) {
        console.log("Error in registerUser",error)
        res.status(500).json({message:"Internal Server Error"})
    }

}