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

// Security Middleware — configure helmet to not interfere with CORS
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
app.use(mongoSanitize());
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);

// CORS — Allow both localhost and production origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://ats-frontend-eta.vercel.app'
];

// Also allow CORS_ORIGIN from env if set and not already in the list
if (process.env.CORS_ORIGIN && !allowedOrigins.includes(process.env.CORS_ORIGIN)) {
    allowedOrigins.push(process.env.CORS_ORIGIN);
}

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body Parser with limit
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working', env: process.env.NODE_ENV });
});

// Error Handler
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
