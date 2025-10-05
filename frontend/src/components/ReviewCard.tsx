import { Review } from '@/contexts/BookContext';
import { Card } from '@/components/ui/card';
import { Star, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  review: Review;
  index: number;
}

const ReviewCard = ({ review, index }: ReviewCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 hover:shadow-card transition-shadow">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{review.userName}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating 
                      ? 'fill-primary text-primary' 
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-foreground">{review.comment}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReviewCard;
