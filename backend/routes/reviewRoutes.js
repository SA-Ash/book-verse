import express from 'express';
import {
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
  getReviewById
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { validateReview } from '../middleware/validation.js';
import { checkReviewOwnership } from '../middleware/ownership.js';

const router = express.Router();

router.get('/book/:bookId', getReviewsByBook);
router.get('/:id', getReviewById);
router.post('/book/:bookId', protect, validateReview, createReview);
router.put('/:id', protect, checkReviewOwnership, validateReview, updateReview);
router.delete('/:id', protect, checkReviewOwnership, deleteReview);

export default router;
