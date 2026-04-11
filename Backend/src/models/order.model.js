import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    }
})

export default mongoose.model('Order',OrderSchema)