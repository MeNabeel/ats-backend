import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';
import errorHandler from './middleware/error.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173' || 'https://ats-frontend-eta.vercel.app',
    credentials: true
}));

// Body Parser with limit
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working' });
});

// Error Handler
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
