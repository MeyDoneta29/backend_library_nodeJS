import express from 'express';
import { getBorrows, createBorrow, returnBorrow } from '../controllers/borrowController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getBorrows);
router.post('/', auth, createBorrow);
router.put('/return/:id', auth, returnBorrow);

export default router;