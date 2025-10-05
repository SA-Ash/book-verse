import { useAuth } from '@/contexts/AuthContext';
import { useBooks } from '@/contexts/BookContext';
import BookCard from '@/components/BookCard';
import ReviewCard from '@/components/ReviewCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useAuth();
  const { books } = useBooks();

  const userBooks = books.filter(book => book.addedBy === user?.id);
  const userReviews = books.flatMap(book => 
    book.reviews
      .filter(review => review.userId === user?.id)
      .map(review => ({ ...review, bookTitle: book.title, bookId: book.id }))
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4 bg-secondary rounded-lg">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{userBooks.length}</p>
                <p className="text-sm text-muted-foreground">Books Added</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{userReviews.length}</p>
                <p className="text-sm text-muted-foreground">Reviews Written</p>
              </div>
              <div className="text-center p-4 bg-secondary rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">
                  {userReviews.length > 0 
                    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
                    : '0'}
                </p>
                <p className="text-sm text-muted-foreground">Average Rating Given</p>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="books" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="books">My Books</TabsTrigger>
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="mt-6">
              {userBooks.length === 0 ? (
                <Card className="p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">You haven't added any books yet</p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBooks.map((book, index) => (
                    <BookCard key={book.id} book={book} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              {userReviews.length === 0 ? (
                <Card className="p-8 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">You haven't written any reviews yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userReviews.map((review, index) => (
                    <div key={review.id}>
                      <p className="text-sm text-muted-foreground mb-2">
                        Review for <span className="font-medium text-foreground">{review.bookTitle}</span>
                      </p>
                      <ReviewCard review={review} index={index} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
