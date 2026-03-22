import express from 'express';
import { getMembers, createMember, updateMember, deleteMember } from '../controllers/memberController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getMembers);
router.post('/', auth, createMember);
router.put('/:id', auth, updateMember);
router.delete('/:id', auth, deleteMember);

export default router;