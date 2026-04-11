import mongoose from "mongoose"
const lectureSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    video:{
        type:String,
    
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }

})

export default mongoose.model('Lecture',lectureSchema)