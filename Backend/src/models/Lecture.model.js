import mongoose from "mongoose"
const lectureSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    
    },
    duration:{
        type:Number
    }

},{timestamps:true})

export default mongoose.model('Lecture',lectureSchema)