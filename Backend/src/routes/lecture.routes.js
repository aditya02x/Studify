import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import { 
  createLecture, 
  getLecturesByCourse, 
  deleteLecture, 
  CreateComment, 
  getCommentsByLecture 
} from "../controllers/Lecture.controller.js";
import isInstructor from "../middleware/Instructor.middleware.js";

const router = express.Router();


router.post('/:lectureId/comments', authMiddleware, CreateComment);
