import Lecture from '../models/Lecture.model.js'
import Course from '../models/Course.Model.js'

export const createLecture = async (req,res)=>{
    try {
        const {title , video , duration , courseId}=req.body

        if(!title || !video || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const lecture = await Lecture.create({
            title,
            video,
            duration
        })

        await Course.findByIdAndUpdate(courseId,{
            $push:{lecture:lecture._id}
        })
        
    } catch (error) 
    {
        console.error(error)
       return res.status(500).json({message:"Internal Server Error"})
        
    }
}