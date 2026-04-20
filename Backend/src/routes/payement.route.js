import express, { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payement.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router()
router.post('/create-order',authMiddleware,createOrder);
router.post("/verify",authMiddleware,verifyPayment)

export default router