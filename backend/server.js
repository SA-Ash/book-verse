import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'BookVerse API is running!' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working!', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
