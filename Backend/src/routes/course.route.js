import express from "express";
import { createCourse, getAllCourses, deleteCourse, getSingleCourse, getMyCourses } from "../controllers/course.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isInstructor from "../middleware/Instructor.middleware.js";

const router = express.Router();

router.post('/', authMiddleware, isInstructor, createCourse);
router.get('/', getAllCourses);
router.get('/my-courses', authMiddleware, getMyCourses); // ✅ MOVED UP - before /:id
router.get('/:id', getSingleCourse);                     // ✅ now below
router.delete('/:id', authMiddleware, isInstructor, deleteCourse);

export default router;