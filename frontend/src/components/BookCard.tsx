import { Link } from 'react-router-dom';
import { Book } from '@/contexts/BookContext';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
  index: number;
}

const BookCard = ({ book, index }: BookCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/books/${book.id}`}>
        <Card className="overflow-hidden group cursor-pointer hover:shadow-elegant transition-all duration-300 h-full">
          <div className="relative overflow-hidden aspect-[2/3]">
            <img 
              src={book.coverImage} 
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-medium">
                  {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({book.reviews.length} {book.reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                {book.genre}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default BookCard;
