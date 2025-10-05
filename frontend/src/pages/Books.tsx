import { useState, useMemo, useEffect } from 'react';
import { useBooks } from '@/contexts/BookContext';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Books = () => {
  const { books, loading, error, fetchBooks } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const genres = ['all', ...Array.from(new Set(books.map(book => book.genre)))];

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (genreFilter !== 'all') {
      result = result.filter(book => book.genre === genreFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'year':
          return b.publishedYear - a.publishedYear;
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchQuery, genreFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const paginatedBooks = filteredAndSortedBooks.slice(startIndex, startIndex + booksPerPage);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Discover Books</h1>
          <p className="text-muted-foreground">
            Browse through our collection of {books.length} amazing books
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_auto_auto] gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select value={genreFilter} onValueChange={(value) => {
            setGenreFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg">{error}</p>
            <Button onClick={() => fetchBooks()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : paginatedBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No books found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedBooks.map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Books;
