import express from 'express';
import { getBooks, createBook, updateBook, deleteBook, upload } from '../controllers/bookController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/',    auth, getBooks);
router.post('/',   auth, upload.single('cover_image'), createBook);
router.put('/:id', auth, upload.single('cover_image'), updateBook);
router.delete('/:id', auth, deleteBook);

export default router;
