import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);

    const isFavorite = user.favorites.includes(bookId);
    
    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== bookId);
    } else {
      user.favorites.push(bookId);
    }

    await user.save();
    res.json({ 
      isFavorite: !isFavorite,
      favorites: user.favorites 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user._id);

    const isBookmarked = user.bookmarks.includes(bookId);
    
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== bookId);
    } else {
      user.bookmarks.push(bookId);
    }

    await user.save();
    res.json({ 
      isBookmarked: !isBookmarked,
      bookmarks: user.bookmarks 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
