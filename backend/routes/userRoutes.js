import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  toggleFavorite,
  toggleBookmark,
  getFavorites,
  getBookmarks
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validateUser } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/favorites/:bookId', protect, toggleFavorite);
router.post('/bookmarks/:bookId', protect, toggleBookmark);
router.get('/favorites', protect, getFavorites);
router.get('/bookmarks', protect, getBookmarks);

export default router;
