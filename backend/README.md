# BookVerse Backend API

A secure and scalable backend API for a Book Review Platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 User authentication with JWT
- 📚 Book CRUD operations with ownership validation
- ⭐ Review system with dynamic rating calculation
- ❤️ Favorites and bookmarks functionality
- 📖 Reading status tracking (Want to Read, Reading, Read, Did Not Finish)
- 📄 Pagination for books (5 per page)
- 🔍 Search functionality
- ✅ Input validation and error handling
- 🛡️ Security middleware (helmet, rate limiting, CORS)
- 🖼️ Image upload support (local storage)

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Multer for file uploads

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookverse?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

3. Start the server:
```bash
npm run dev

npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

### Favorites & Bookmarks
- `POST /api/users/favorites/:bookId` - Toggle favorite status (protected)
- `POST /api/users/bookmarks/:bookId` - Toggle bookmark status (protected)
- `GET /api/users/favorites` - Get user's favorite books (protected)
- `GET /api/users/bookmarks` - Get user's bookmarked books (protected)

### Books
- `GET /api/books` - Get all books (paginated, 5 per page)
- `GET /api/books/search?q=query` - Search books by title or author
- `GET /api/books/:id` - Get book details with reviews and similar books
- `POST /api/books` - Create a new book with cover image (protected)
- `PUT /api/books/:id` - Update book (protected, owner only)
- `PATCH /api/books/:id/status` - Update reading status (protected)
- `DELETE /api/books/:id` - Delete book (protected, owner only)

### Reviews
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews/book/:bookId` - Create a review (protected)
- `PUT /api/reviews/:id` - Update review (protected, owner only)
- `DELETE /api/reviews/:id` - Delete review (protected, owner only)

## Data Models

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `favorites` (Array of Book ObjectIds)
- `bookmarks` (Array of Book ObjectIds)
- `timestamps` (createdAt, updatedAt)

### Book
- `title` (String, required)
- `author` (String, required)
- `description` (String, required)
- `coverImage` (String, required, URL)
- `genre` (String, required, enum: Fiction, Non-Fiction, Mystery, etc.)
- `publishedYear` (Number, required)
- `addedBy` (ObjectId, ref: User)
- `averageRating` (Number, calculated from reviews)
- `status` (String, enum: want-to-read, reading, read, did-not-finish)
- `timestamps` (createdAt, updatedAt)

### Review
- `book` (ObjectId, ref: Book)
- `user` (ObjectId, ref: User)
- `userName` (String, required)
- `rating` (Number, required, 1-5)
- `comment` (String, required)
- `timestamps` (createdAt, updatedAt)

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication with 7-day expiration
- ⏱Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet for security headers
- Ownership validation for protected operations
- Protected routes with authentication middleware

## File Upload

- Cover images are stored locally in `uploads/` directory
- Supported formats: JPG, JPEG, PNG, GIF
- Maximum file size: 5MB
- Files are served statically via `/uploads` route

## Error Handling

The API includes comprehensive error handling with:
- Appropriate HTTP status codes
- Descriptive error messages
- Validation error details
- Centralized error middleware

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | `your-secret-key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
