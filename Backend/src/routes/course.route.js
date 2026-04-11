import express from "express";
import { createCourse , getAllCourses , deleteCourse } from "../controllers/course.controller";
const router = express.Router();

router.post('/create',createCourse);
router.get('/all',getAllCourses);
router.delete('/delete/:id',deleteCourse)

export default router;