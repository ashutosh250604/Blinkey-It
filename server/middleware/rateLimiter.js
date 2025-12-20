import rateLimit from 'express-rate-limit'
import logger from '../utils/logger.js'

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        message: 'Too many requests from this IP, please try again later',
        error: true,
        success: false
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
        res.status(429).json({
            message: 'Too many requests, please try again later',
            error: true,
            success: false
        })
    }
})

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    skipSuccessfulRequests: true,
    message: {
        message: 'Too many login attempts, please try again after 15 minutes',
        error: true,
        success: false
    },
    handler: (req, res) => {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`)
        res.status(429).json({
            message: 'Too many login attempts, please try again after 15 minutes',
            error: true,
            success: false
        })
    }
})

// Rate limiter for password reset
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per hour
    message: {
        message: 'Too many password reset attempts, please try again later',
        error: true,
        success: false
    },
    handler: (req, res) => {
        logger.warn(`Password reset rate limit exceeded for IP: ${req.ip}`)
        res.status(429).json({
            message: 'Too many password reset attempts, please try again after an hour',
            error: true,
            success: false
        })
    }
})

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 uploads per window
    message: {
        message: 'Too many upload requests, please try again later',
        error: true,
        success: false
    }
})
