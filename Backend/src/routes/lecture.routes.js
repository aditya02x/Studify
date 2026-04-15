import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import { createLecture , getLecturesByCourse , deleteLecture } from "../controllers/Lecture.controller.js";
import isInstructor from "../middleware/Instructor.middleware.js";
const router = express.Router();
router.post('/create', authMiddleware, isInstructor, createLecture);
router.get('/:courseId', authMiddleware, getLecturesByCourse);
router.delete('/:lectureId', authMiddleware, isInstructor, deleteLecture);
