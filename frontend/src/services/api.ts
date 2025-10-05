import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/users/register', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  toggleFavorite: (bookId: string) => api.post(`/users/favorites/${bookId}`),
  toggleBookmark: (bookId: string) => api.post(`/users/bookmarks/${bookId}`),
  getFavorites: () => api.get('/users/favorites'),
  getBookmarks: () => api.get('/users/bookmarks'),
};

export const booksAPI = {
  getBooks: (page = 1) => api.get(`/books?page=${page}`),
  getBook: (id: string) => api.get(`/books/${id}`),
  createBook: (bookData: FormData) => api.post('/books', bookData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBook: (id: string, bookData: FormData) => api.put(`/books/${id}`, bookData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBookStatus: (id: string, status: string) => api.patch(`/books/${id}/status`, { status }),
  deleteBook: (id: string) => api.delete(`/books/${id}`),
  searchBooks: (query: string, page = 1) => api.get(`/books/search?q=${query}&page=${page}`),
};

export const reviewsAPI = {
  getReviews: (bookId: string) => api.get(`/reviews/book/${bookId}`),
  createReview: (bookId: string, reviewData: { rating: number; comment: string }) =>
    api.post(`/reviews/book/${bookId}`, reviewData),
  updateReview: (id: string, reviewData: { rating: number; comment: string }) =>
    api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

export default api;
