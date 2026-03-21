import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import {validate} from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';
import {registerSchema} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register',validate(registerSchema), register);
router.post('/login', login);
router.get('/profile', auth, validate(registerSchema), getProfile);

export default router;