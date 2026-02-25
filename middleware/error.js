const errorHandler = (err, req, res, next) => {
    // Only log stack traces in non-production
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        // Only hide message for actual 500 server errors in production
        // User-facing errors (4xx) should always show their messages
        error: process.env.NODE_ENV === 'production' && statusCode === 500
            ? 'Server Error'
            : (error.message || 'Server Error')
    });
};

export default errorHandler;
