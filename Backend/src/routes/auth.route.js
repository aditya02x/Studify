import express from 'express';
import { registerUser , LoginUser, toggleBookmark, getBookmarkedCourses } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/register',registerUser)
router.post('/login',LoginUser);
router.post('/bookmark/:courseId' ,authMiddleware,toggleBookmark)
router.get('/my-courses',authMiddleware , getBookmarkedCourses) 

export default router;