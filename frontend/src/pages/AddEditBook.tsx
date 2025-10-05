import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '@/contexts/BookContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, addBook, updateBook } = useBooks();
  const { user } = useAuth();
  const isEditing = !!id;
  const book = isEditing ? books.find(b => b.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    genre: 'Fiction',
    publishedYear: new Date().getFullYear()
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: book.coverImage,
        genre: book.genre,
        publishedYear: book.publishedYear
      });
      setPreviewUrl(book.coverImage);
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const bookData = {
        ...formData,
        addedBy: user.id,
        coverImage: selectedFile || formData.coverImage
      };

      if (isEditing && book) {
        await updateBook(book.id, bookData);
        toast.success('Book updated successfully!');
      } else {
        await addBook(bookData);
        toast.success('Book added successfully!');
      }
      navigate('/books');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save book');
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
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
        >
          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6">
              {isEditing ? 'Edit Book' : 'Add New Book'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="The Great Gatsby"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="F. Scott Fitzgerald"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="A brief description of the book..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="space-y-4">
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <div className="text-sm text-muted-foreground">
                    Or enter a URL:
                  </div>
                  <Input
                    value={formData.coverImage}
                    onChange={(e) => handleChange('coverImage', e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                  />
                  {previewUrl && (
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-48 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select 
                    value={formData.genre} 
                    onValueChange={(value) => handleChange('genre', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                      <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Mystery">Mystery</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Classic">Classic</SelectItem>
                      <SelectItem value="Biography">Biography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishedYear">Published Year</Label>
                  <Input
                    id="publishedYear"
                    type="number"
                    value={formData.publishedYear}
                    onChange={(e) => handleChange('publishedYear', parseInt(e.target.value))}
                    min="1000"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {isEditing ? 'Update Book' : 'Add Book'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/books')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AddEditBook;
