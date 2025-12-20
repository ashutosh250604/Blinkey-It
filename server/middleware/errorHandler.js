import logger from '../utils/logger.js'

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    })

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            error: true,
            success: false,
            details: isDevelopment ? err.message : undefined
        })
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid ID format',
            error: true,
            success: false
        })
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token',
            error: true,
            success: false
        })
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired',
            error: true,
            success: false
        })
    }

    // Duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate entry',
            error: true,
            success: false,
            details: isDevelopment ? err.message : undefined
        })
    }

    // Default error
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal server error',
        error: true,
        success: false,
        stack: isDevelopment ? err.stack : undefined
    })
}

// Async error wrapper
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

// 404 handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        error: true,
        success: false,
        path: req.path
    })
}

export default errorHandler
