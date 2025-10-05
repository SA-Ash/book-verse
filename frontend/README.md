# BookVerse Frontend

A modern, responsive book review platform built with React, TypeScript, and Vite.

## Features

-User authentication (Register/Login)
-Browse and search books
-Interactive star rating system for reviews
-Add books to favorites
-Bookmark books for later
-Track reading status (Want to Read, Reading, Read, Did Not Finish)
-Write and submit reviews
-Edit and delete your own books
-Search functionality
-Fully responsive design
-Modern UI with Tailwind CSS and shadcn/ui
-Smooth animations with Framer Motion
-Toast notifications for user feedback

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Icon library
- **React Query** - Data fetching and caching

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── BookCard.tsx   # Book display card
│   │   ├── ReviewCard.tsx # Review display card
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx
│   │   └── BookContext.tsx
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Books.tsx
│   │   ├── BookDetails.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
└── package.json
```

## Key Features

### Authentication
- JWT-based authentication
- Protected routes
- Persistent login with localStorage
- Auto-redirect on token expiration

### Book Management
- Browse all books with pagination
- Search books by title or author
- View detailed book information
- Create new books (authenticated users)
- Edit/delete your own books
- Upload book cover images

### Reviews & Ratings
- Interactive 5-star rating system
- Write detailed reviews
- View all reviews for a book
- Rating distribution visualization
- Average rating calculation

### User Interactions
- **Favorites**: Save books you love
- **Bookmarks**: Mark books to read later
- **Reading Status**: Track your reading progress
- **Share**: Share books via Web Share API or clipboard

### UI/UX
- Responsive design for all screen sizes
- Smooth page transitions
- Loading states and skeletons
- Error handling with user-friendly messages
- Toast notifications for actions
- Modern card-based layout
- Hover effects and animations

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. All API calls are centralized in `src/services/api.ts`:

- **authAPI**: Authentication endpoints
- **booksAPI**: Book CRUD operations
- **reviewsAPI**: Review operations

## Components

### UI Components (shadcn/ui)
- Button
- Card
- Input
- Textarea
- Select
- Dialog
- Badge
- Label
- Tooltip

### Custom Components
- **BookCard**: Displays book information in a card format
- **ReviewCard**: Shows individual reviews with ratings
- **ProtectedRoute**: Route wrapper for authenticated pages

## Styling

The app uses **TailwindCSS** for styling with a custom theme configuration:

- Custom color palette
- Responsive breakpoints
- Dark mode support (ready)
- Custom animations
- Utility classes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Build & Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The production build will be created in the `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

- Hot Module Replacement (HMR) is enabled for fast development
- TypeScript provides type safety and better IDE support
- ESLint is configured for code quality
- Use the React DevTools extension for debugging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
