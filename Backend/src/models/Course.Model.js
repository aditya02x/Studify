import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ispaid:{
        type:Boolean,
        default:false

    },
    thumbnail: {
        type: String,
        default: "https://www.shutterstock.com/image-vector/default-placeholder-image-vector-260nw-138556879.jpg"
    },
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ],
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);