import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

export const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateBook = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Author must be between 1 and 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('coverImage')
    .optional()
    .custom((value, { req }) => {
      if (!req.file && !value) {
        throw new Error('Cover image is required');
      }
      if (value && !value.match(/^https?:\/\/.+/)) {
        throw new Error('Please provide a valid cover image URL');
      }
      return true;
    }),
  body('genre')
    .isIn(['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Classic', 'Biography'])
    .withMessage('Please select a valid genre'),
  body('publishedYear')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Please provide a valid published year'),
  handleValidationErrors
];

export const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  handleValidationErrors
];
