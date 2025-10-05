import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const checkBookOwnership = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    req.book = book;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkReviewOwnership = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    req.review = review;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
