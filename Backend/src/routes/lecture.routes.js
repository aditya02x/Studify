import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import { createLecture } from "../controllers/Lecture.controller.js";
import isInstructor from "../middleware/Instructor.middleware.js";
const router = express.Router();
router.post('/', authMiddleware, isInstructor, createLecture);

export default router;