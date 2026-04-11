import express from 'express';
import { registerUser , LoginUser } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/register',registerUser)
router.post('/login',LoginUser);

export default router;