import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .populate('addedBy', 'name')
      .populate('reviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.json({
      books,
      currentPage: page,
      totalPages,
      totalBooks: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const similarBooks = await Book.find({
      genre: book.genre,
      _id: { $ne: book._id }
    })
      .populate('addedBy', 'name')
      .populate('reviews')
      .sort({ averageRating: -1 })
      .limit(4);

    const reviewStats = {
      totalReviews: book.reviews.length,
      averageRating: book.averageRating,
      ratingDistribution: {
        5: book.reviews.filter(r => r.rating === 5).length,
        4: book.reviews.filter(r => r.rating === 4).length,
        3: book.reviews.filter(r => r.rating === 3).length,
        2: book.reviews.filter(r => r.rating === 2).length,
        1: book.reviews.filter(r => r.rating === 1).length
      }
    };

    res.json({
      book,
      similarBooks,
      reviewStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const bookData = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      genre: req.body.genre,
      publishedYear: parseInt(req.body.publishedYear),
      addedBy: req.user._id,
      reviews: []
    };

    if (req.file) {
      bookData.coverImage = `/uploads/${req.file.filename}`;
    } else if (req.body.coverImage) {
      bookData.coverImage = req.body.coverImage;
    } else {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    const book = await Book.create(bookData);

    const populatedBook = await Book.findById(book._id)
      .populate('addedBy', 'name')
      .populate('reviews');

    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      genre: req.body.genre,
      publishedYear: parseInt(req.body.publishedYear)
    };

    if (req.file) {
      updateData.coverImage = `/uploads/${req.file.filename}`;
    } else if (req.body.coverImage) {
      updateData.coverImage = req.body.coverImage;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name').populate('reviews');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Review.deleteMany({ book: req.params.id });
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['want-to-read', 'reading', 'read', 'did-not-finish'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('addedBy', 'name').populate('reviews');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const books = await Book.find({
      $text: { $search: q }
    })
      .populate('addedBy', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments({
      $text: { $search: q }
    });
    const totalPages = Math.ceil(total / limit);

    res.json({
      books,
      currentPage: page,
      totalPages,
      totalBooks: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
