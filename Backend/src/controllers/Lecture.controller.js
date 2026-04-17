import mongoose from 'mongoose';
import Lecture from '../models/Lecture.model.js';
import Course from '../models/Course.Model.js';
import Comment from '../models/Comment.model.js';

// CREATE LECTURE
export const createLecture = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, video, duration, courseId } = req.body;

    if (!title || !video || !duration || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // create lecture
    const lecture = await Lecture.create([{
      title,
      video,
      duration,
      course: courseId
    }], { session });

    // push into course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { lectures: lecture[0]._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      lecture: lecture[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


// GET LECTURES BY COURSE
export const getLecturesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }

    // ✅ TEMP: allow everyone (so you can continue building)
    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// DELETE LECTURE
export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const deleted = await Lecture.findByIdAndDelete(lectureId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Lecture Not Found"
      });
    }

    // remove from course
    await Course.findOneAndUpdate(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const CreateComment = async (req,res)=>{
  const {lectureId} = req.params;
  const {content} = req.body;
  const userId = req.user._id;

  try {
    const lecture = await Lecture.findById(lectureId);
    if(!lecture){
      return res.status(404).json({
        success: false,
        message: "Lecture Not Found"
      });
    }
    const newComment = await Comment.create({
      content,
      user: userId,
      lecture: lectureId
    });
   lecture.comments.push(comment._id);
    await lecture.save();




      return res.status(201).json({ 
          success: true,
          comment: newComment
        });
    
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          success: false,
          message: "Internal Server Error"
      });
    
  }

}
