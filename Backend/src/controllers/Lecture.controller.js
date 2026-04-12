import Lecture from '../models/Lecture.model.js';
import Course from '../models/Course.Model.js';

export const createLecture = async (req, res) => {
  try {
    const { title, video, duration, courseId } = req.body;

    if (!title || !video || !courseId || !duration) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const lecture = await Lecture.create({
      title,
      video,
      duration
    });

    await Course.findByIdAndUpdate(courseId, {
      $push: { lectures: lecture._id }
    });

    return res.status(201).json({
      success: true,
      lecture
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getLecturesByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({message:"Course Not Found"})
        }
        return res.status(200).json({
            success: true,
            lectures: course.lectures
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const deleteLecture = async (req, res) => {
    try {
        const LectureId = req.params.lectureId;
        const lecture = await Lecture.findById(LectureId);
        if(!lecture){
            return res.status(404).json({message:"Lecture Not Found"})
        }
        await Lecture.findByIdAndDelete(LectureId);

        await Course.findOneAndUpdate(
            { lectures: LectureId },
            { $pull: { lectures: LectureId } }
        );
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}