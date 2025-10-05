import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image URL is required']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Romance',
      'Classic',
      'Biography'
    ]
  },
  publishedYear: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Published year must be valid'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  status: {
    type: String,
    enum: ['want-to-read', 'reading', 'read', 'did-not-finish'],
    default: 'want-to-read'
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

export default mongoose.model('Book', bookSchema);
