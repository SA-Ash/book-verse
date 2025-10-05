import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  updateBookStatus
} from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';
import { validateBook } from '../middleware/validation.js';
import { checkBookOwnership } from '../middleware/ownership.js';
import { upload } from '../middleware/uploadLocal.js';

const router = express.Router();

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);
router.post('/', protect, upload.single('coverImage'), validateBook, createBook);
router.put('/:id', protect, checkBookOwnership, upload.single('coverImage'), validateBook, updateBook);
router.patch('/:id/status', protect, updateBookStatus);
router.delete('/:id', protect, checkBookOwnership, deleteBook);

export default router;
