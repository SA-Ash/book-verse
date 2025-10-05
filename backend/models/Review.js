import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

reviewSchema.index({ book: 1, user: 1 }, { unique: true });

reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.book);
});

reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.book);
  }
});

reviewSchema.statics.calculateAverageRating = async function(bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId }
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10
    });
  } else {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      averageRating: 0
    });
  }
};

export default mongoose.model('Review', reviewSchema);
