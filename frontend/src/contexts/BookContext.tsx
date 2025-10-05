/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { booksAPI, reviewsAPI } from '@/services/api';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string;
  publishedYear: number;
  reviews: Review[];
  averageRating: number;
  addedBy: string;
  status?: 'want-to-read' | 'reading' | 'read' | 'did-not-finish';
}

interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (book: Omit<Book, 'id' | 'reviews' | 'averageRating'>) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  updateBookStatus: (id: string, status: string) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addReview: (bookId: string, review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  fetchBooks: (page?: number) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    genre: 'Classic',
    publishedYear: 1925,
    addedBy: '1',
    reviews: [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        rating: 5,
        comment: 'An absolute masterpiece! The prose is beautiful and the story timeless.',
        createdAt: new Date().toISOString()
      }
    ],
    averageRating: 5
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
    coverImage: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop',
    genre: 'Science Fiction',
    publishedYear: 1949,
    addedBy: '1',
    reviews: [
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Chilling and thought-provoking. More relevant today than ever.',
        createdAt: new Date().toISOString()
      }
    ],
    averageRating: 4
  },
  {
    id: '3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A powerful story of racial injustice and childhood innocence in the American South.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    genre: 'Classic',
    publishedYear: 1960,
    addedBy: '1',
    reviews: [],
    averageRating: 0
  },
  {
    id: '4',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'A fantasy adventure following Bilbo Baggins on an epic quest.',
    coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
    genre: 'Fantasy',
    publishedYear: 1937,
    addedBy: '1',
    reviews: [
      {
        id: '3',
        userId: '3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'The perfect introduction to Middle-earth. A timeless adventure.',
        createdAt: new Date().toISOString()
      }
    ],
    averageRating: 5
  },
  {
    id: '5',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners exploring love, marriage, and social class.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    genre: 'Romance',
    publishedYear: 1813,
    addedBy: '1',
    reviews: [],
    averageRating: 0
  },
  {
    id: '6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A story of teenage rebellion and alienation in post-war America.',
    coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop',
    genre: 'Classic',
    publishedYear: 1951,
    addedBy: '1',
    reviews: [],
    averageRating: 0
  }
];

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getBooks(page);
      // Map _id to id for frontend compatibility
      const mappedBooks = response.data.books.map((book: any) => ({
        ...book,
        id: book._id
      }));
      setBooks(mappedBooks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = async (book: Omit<Book, 'id' | 'reviews' | 'averageRating'>) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('title', book.title);
      formData.append('author', book.author);
      formData.append('description', book.description);
      formData.append('genre', book.genre);
      formData.append('publishedYear', book.publishedYear.toString());
      
      if (book.coverImage instanceof File) {
        formData.append('coverImage', book.coverImage);
      } else if (typeof book.coverImage === 'string') {
        formData.append('coverImage', book.coverImage);
      }

      const response = await booksAPI.createBook(formData);
      const newBook = { ...response.data, id: response.data._id };
      setBooks([newBook, ...books]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, updatedBook: Partial<Book>) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      
      if (updatedBook.title) formData.append('title', updatedBook.title);
      if (updatedBook.author) formData.append('author', updatedBook.author);
      if (updatedBook.description) formData.append('description', updatedBook.description);
      if (updatedBook.genre) formData.append('genre', updatedBook.genre);
      if (updatedBook.publishedYear) formData.append('publishedYear', updatedBook.publishedYear.toString());
      
      if (updatedBook.coverImage instanceof File) {
        formData.append('coverImage', updatedBook.coverImage);
      } else if (typeof updatedBook.coverImage === 'string') {
        formData.append('coverImage', updatedBook.coverImage);
      }

      const response = await booksAPI.updateBook(id, formData);
      const updatedBook = { ...response.data, id: response.data._id };
      setBooks(books.map(book => 
        book.id === id ? updatedBook : book
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBookStatus = async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      await booksAPI.updateBookStatus(id, status);
      setBooks(books.map(book => 
        book.id === id ? { ...book, status: status as any } : book
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await booksAPI.deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (bookId: string, review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsAPI.createReview(bookId, {
        rating: review.rating,
        comment: review.comment
      });
      
      setBooks(books.map(book => {
        if (book.id === bookId) {
          const updatedReviews = [...book.reviews, { ...response.data, id: response.data._id }];
          const averageRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...book,
            reviews: updatedReviews,
            averageRating
          };
        }
        return book;
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add review');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider value={{
      books,
      loading,
      error,
      addBook,
      updateBook,
      updateBookStatus,
      deleteBook,
      addReview,
      fetchBooks
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within BookProvider');
  }
  return context;
};
