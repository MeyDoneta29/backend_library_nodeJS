import express from 'express';
import { getBookStats, getMemberStats, getBorrowStats } from '../controllers/statsController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/books',   auth, getBookStats);
router.get('/members', auth, getMemberStats);
router.get('/borrows', auth, getBorrowStats);

export default router;
