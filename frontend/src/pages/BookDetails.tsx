import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { booksAPI, reviewsAPI, authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, ArrowLeft, BookOpen, Calendar, User, Heart, Share2, Bookmark, Edit, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import BookCard from '@/components/BookCard';
import ReviewCard from '@/components/ReviewCard';

interface BookDetailsData {
  book: {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    genre: string;
    publishedYear: number;
    addedBy: {
      _id: string;
      name: string;
    };
    averageRating: number;
    reviews: Array<{
      _id: string;
      user: {
        _id: string;
        name: string;
      };
      rating: number;
      comment: string;
      createdAt: string;
    }>;
    status: string;
    createdAt: string;
  };
  similarBooks: Array<{
    id: string;
    title: string;
    author: string;
    coverImage: string;
    averageRating: number;
    reviews: any[];
  }>;
  reviewStats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookData, setBookData] = useState<BookDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Review state
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Favorites & Bookmarks state
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Edit/Delete state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editCoverImage, setEditCoverImage] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
      checkFavoriteAndBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkFavoriteAndBookmark = async () => {
    if (!user) return;
    try {
      const profile = await authAPI.getProfile();
      setIsFavorite(profile.data.favorites?.includes(id) || false);
      setIsBookmarked(profile.data.bookmarks?.includes(id) || false);
    } catch (err) {
      console.error('Failed to check favorites/bookmarks');
    }
  };

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getBook(id!);
      const mappedData = {
        ...response.data,
        book: {
          ...response.data.book,
          id: response.data.book._id
        },
        similarBooks: response.data.similarBooks.map((book: { _id: string; [key: string]: unknown }) => ({
          ...book,
          id: book._id
        }))
      };
      setBookData(mappedData);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!user) {
      toast.error('Please login to update book status');
      return;
    }

    try {
      setStatusLoading(true);
      await booksAPI.updateBookStatus(id!, newStatus);
      setBookData(prev => prev ? {
        ...prev,
        book: { ...prev.book, status: newStatus }
      } : null);
      toast.success('Book status updated successfully!');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (reviewRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewsAPI.createReview(id!, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted successfully!');
      setShowReviewDialog(false);
      setReviewRating(0);
      setReviewComment('');
      fetchBookDetails();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      const response = await authAPI.toggleFavorite(id!);
      setIsFavorite(response.data.isFavorite);
      toast.success(response.data.isFavorite ? 'Added to favorites!' : 'Removed from favorites');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark');
      return;
    }

    try {
      const response = await authAPI.toggleBookmark(id!);
      setIsBookmarked(response.data.isBookmarked);
      toast.success(response.data.isBookmarked ? 'Bookmarked!' : 'Bookmark removed');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update bookmark');
    }
  };

  const handleShare = async () => {
    if (!bookData) return;
    const { book } = bookData;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author}`,
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleEditBook = async () => {
    if (!editDescription && !editCoverImage) {
      toast.error('Please make at least one change');
      return;
    }

    try {
      setEditLoading(true);
      const formData = new FormData();
      
      if (editDescription) {
        formData.append('description', editDescription);
      }
      if (editCoverImage) {
        formData.append('coverImage', editCoverImage);
      }
      
      // Keep existing data
      formData.append('title', book.title);
      formData.append('author', book.author);
      formData.append('genre', book.genre);
      formData.append('publishedYear', book.publishedYear.toString());

      await booksAPI.updateBook(id!, formData);
      toast.success('Book updated successfully!');
      setShowEditDialog(false);
      setEditDescription('');
      setEditCoverImage(null);
      fetchBookDetails();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    try {
      await booksAPI.deleteBook(id!);
      toast.success('Book deleted successfully!');
      navigate('/books');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'bg-green-100 text-green-800';
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'want-to-read': return 'bg-yellow-100 text-yellow-800';
      case 'did-not-finish': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'read': return 'Read';
      case 'reading': return 'Reading';
      case 'want-to-read': return 'Want to Read';
      case 'did-not-finish': return 'Did Not Finish';
      default: return 'Want to Read';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Book not found</h2>
          <p className="text-muted-foreground mb-6">{error || 'The book you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/books')}>Back to Books</Button>
        </div>
      </div>
    );
  }

  const { book, similarBooks, reviewStats } = bookData;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/books')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[300px_1fr] gap-8 mb-12"
        >
          {/* Book Cover */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-elegant">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </Card>
            
            {/* Book Status */}
            {user && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Reading Status</h3>
                <Select 
                  value={book.status} 
                  onValueChange={handleStatusChange}
                  disabled={statusLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want-to-read">Want to Read</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="did-not-finish">Did Not Finish</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            )}
          </div>

          {/* Book Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-primary text-primary" />
                  <span className="text-2xl font-bold">
                    {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings'}
                  </span>
                </div>
                <Badge className={getStatusColor(book.status)}>
                  {getStatusLabel(book.status)}
                </Badge>
                <Badge variant="outline">{book.genre}</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Published {book.publishedYear}</span>
                </div>
                {book.addedBy && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Added by {book.addedBy.name}</span>
                  </div>
                )}
              </div>

              <p className="text-foreground leading-relaxed text-lg">{book.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {user && user._id === book.addedBy?._id && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditDescription(book.description);
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Book
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Book
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleToggleFavorite}
                className={isFavorite ? 'text-red-600' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-600' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleToggleBookmark}
                className={isBookmarked ? 'text-blue-600' : ''}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-blue-600' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
            
            {/* Rating Statistics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {reviewStats.averageRating > 0 ? reviewStats.averageRating.toFixed(1) : '0.0'}
                </div>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(reviewStats.averageRating) 
                          ? 'fill-primary text-primary' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-4">{rating}</span>
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ 
                          width: `${reviewStats.totalReviews > 0 ? (reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution] / reviewStats.totalReviews) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Review Button */}
            {user && (
              <Button 
                onClick={() => setShowReviewDialog(true)}
                className="mb-6"
              >
                <Star className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            )}

            {/* Reviews List */}
            {book.reviews.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews yet. Be the first to review this book!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {book.reviews.map((review, index) => (
                  <ReviewCard 
                    key={review._id} 
                    review={{
                      id: review._id,
                      userId: review.user._id,
                      userName: review.user.name,
                      rating: review.rating,
                      comment: review.comment,
                      createdAt: review.createdAt
                    }} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Similar Books */}
          {similarBooks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Similar Books</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarBooks.map((similarBook, index) => (
                  <BookCard 
                    key={similarBook.id} 
                    book={{
                      id: similarBook.id,
                      title: similarBook.title,
                      author: similarBook.author,
                      coverImage: similarBook.coverImage,
                      averageRating: similarBook.averageRating,
                      reviews: similarBook.reviews,
                      description: '',
                      genre: book.genre,
                      publishedYear: 0,
                      addedBy: ''
                    }} 
                    index={index} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts about this book
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                      star <= (hoverRating || reviewRating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Write your review here..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update the description or cover image
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={6}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="edit-cover">Cover Image</Label>
              <Input
                id="edit-cover"
                type="file"
                accept="image/*"
                onChange={(e) => setEditCoverImage(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBook} disabled={editLoading}>
              {editLoading ? 'Updating...' : 'Update Book'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookDetails;