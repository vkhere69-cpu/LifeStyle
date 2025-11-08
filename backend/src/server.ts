import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import youtubeRoutes from './routes/youtube.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import blogRoutes from './routes/blog.routes.js';
import contactRoutes from './routes/contact.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import heroRoutes from './routes/hero.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';
import './scheduler/youtube.scheduler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    // YouTube scheduler is self-initializing when imported
    if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
      console.warn('YouTube API key or Channel ID not found. YouTube sync is disabled.');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
