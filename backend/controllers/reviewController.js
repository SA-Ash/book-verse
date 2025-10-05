import Review from '../models/Review.js';
import Book from '../models/Book.js';

export const getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingReview = await Review.findOne({
      book: req.params.bookId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      ...req.body,
      book: req.params.bookId,
      user: req.user._id,
      userName: req.user.name
    });

    await Book.findByIdAndUpdate(req.params.bookId, {
      $push: { reviews: review._id }
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Book.findByIdAndUpdate(review.book, {
      $pull: { reviews: review._id }
    });

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name')
      .populate('book', 'title');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
