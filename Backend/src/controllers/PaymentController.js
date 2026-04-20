import razorpay from "../utils/razorpay";
import Course from "../models/Course.Model.js";

export const createOrder = async (req,res)=>{
    try {
        const {courseId} = req.body ;

        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message :"Course not found"})
        }
        if(course.price <= 0){
            return res.status(400).json({message : "Free Courses"})
        }

        const order = await razorpay.orders.create({
            amount:course.price*100, 
            currency:"INR"
        })

        res.json(order)
        
    } catch (error) {
        console.error("Create Order error " ,error);
        res.status(500).json({message:"Server Error"})
        
    }
}