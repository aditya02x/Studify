import Course from '../models/Course.Model.js';
import Purchase from '../models/Purchase.model.js';

export const createCourse = async (req, res) => {
    try {
        const { title, description, price, thumbnail } = req.body;

        // ✅ validation
        if (!title?.trim() || !description?.trim() || !price || price <= 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        // ✅ create course
        const newCourse = new Course({
            title: title.trim(),
            description: description.trim(),
            price,
            thumbnail: thumbnail || "https://www.shutterstock.com/image-vector/default-placeholder-image-vector-260nw-138556879.jpg",
            instructor: req.user._id
        });

        await newCourse.save();

        return res.status(201).json({
            message: "Course created successfully",
            course: newCourse
        });

    } catch (error) {
        console.error("Error in createCourse", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .select('title price thumbnail instructor createdAt')
            .populate('instructor', 'name');

        return res.status(200).json({
            success: true,
            courses
        });

    } catch (error) {
        console.error("Error in getAllCourses", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getSingleCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const userId = req.user?._id;

        const course = await Course.findById(courseId).select('title description price thumbnail createdAt updatedAt').populate('instructor', 'name email');
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        let hasPurchased = false;
        if(userId){
           const purchase = await Purchase.findOne({
            userId,
            courseId
           })
           hasPurchased = !!purchase;
        }
        if (course.price > 0 && !hasPurchased) {
            return res.status(403).json({
                message: "Please purchase this course"
            });
        }

        
        return res.status(200).json({
            success: true,
            course
        });
        
    } catch (error) {
        console.error("Error in getSingleCourse", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deleteCourse = async (req,res)=>{
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({message:"Course Not Found"})
        }

        if(course.instructor.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to delete this course"})
        }

        await course.deleteOne();

        return res.status(200).json({message:"Course Deleted Successfully"})

        
    } catch (error) {
        console.error("Error in deleteCourse", error);
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}