import Course from "../models/Course.Model.js";
import Purchase from "../models/Purchase.model.js";

// ✅ CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail } = req.body;

    // ✅ validation (FIXED)
    if (!title?.trim() || !description?.trim() || price == null || price < 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const newCourse = new Course({
      title: title.trim(),
      description: description.trim(),
      price,
      thumbnail:
        thumbnail ||
        "https://via.placeholder.com/300",
      instructor: req.user._id,
    });

    await newCourse.save();

    return res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error in createCourse", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select("title price thumbnail instructor createdAt")
      .populate("instructor", "name");

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error in getAllCourses", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ GET SINGLE COURSE (IMPROVED LOGIC)
export const getSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?._id;

    const course = await Course.findById(courseId)
      .select(
        "title description price thumbnail createdAt updatedAt instructor"
      )
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let hasPurchased = false;

    if (userId) {
      const purchase = await Purchase.findOne({
        userId,
        courseId,
      });
      hasPurchased = !!purchase;
    }

    // ✅ IMPORTANT: don't block course details
    return res.status(200).json({
      success: true,
      course,
      hasPurchased,
    });
  } catch (error) {
    console.error("Error in getSingleCourse", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ DELETE COURSE
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course Not Found" });
    }

    // ✅ authorization check
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }

    await course.deleteOne();

    return res.status(200).json({
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    console.error("Error in deleteCourse", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .select("title price thumbnail createdAt");

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error in getMyCourses", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};