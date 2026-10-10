import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import passport from './config/passport';

const app = express();

// Security and utility Middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or matching origins
    if (!origin || origin.includes('localhost') || origin.includes('vercel.app') || (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window`
  message: { status: 'error', message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Passport initialization
app.use(passport.initialize());

import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import favoriteRoutes from './routes/favorite.routes';
import adminRoutes from './routes/admin.routes';
import reviewRoutes from './routes/review.routes';
import notificationRoutes from './routes/notification.routes';
import uploadRoutes from './routes/upload.routes';
import otpRoutes from './routes/otp.routes';

// New routes imports
import locationRoutes from './routes/location.routes';
import categoryRoutes from './routes/category.routes';
import blogRoutes from './routes/blog.routes';
import contactRoutes from './routes/contact.routes';
import appointmentRoutes from './routes/appointment.routes';
import settingsRoutes from './routes/settings.routes';
import transactionRoutes from './routes/transaction.routes';
import contentRoutes from './routes/content.routes';
import roleRoutes from './routes/role.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/otp', otpRoutes);

// New Routes registration
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/roles', roleRoutes);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

export default app;
