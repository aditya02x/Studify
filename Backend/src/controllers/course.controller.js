import Course from '../models/Course.Model.js';

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

