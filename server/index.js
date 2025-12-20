import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import connectDB from './config/connectDB.js'
import createIndexes from './config/createIndexes.js'
import logger from './utils/logger.js'
import validateEnvironment from './utils/validateEnvironment.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

// Validate environment variables before starting
try {
    validateEnvironment()
} catch (error) {
    logger.error('Environment validation failed:', error)
    process.exit(1)
}

const app = express()

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    }
}))

// CORS configuration
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
} else {
    app.use(morgan('combined'))
}

const PORT = process.env.PORT || 8080

// Health check endpoint
app.get("/health", (request, response) => {
    response.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    })
})

// Root endpoint
app.get("/", (request, response) => {
    response.json({
        message: "Blinkey It API Server",
        version: "1.0.0",
        status: "running"
    })
})

// API routes
app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use('/api/order', orderRouter)

// 404 handler
app.use(notFoundHandler)

// Global error handler (must be last)
app.use(errorHandler)

// Graceful shutdown handler
const gracefulShutdown = () => {
    logger.info('Received shutdown signal, closing server gracefully...')
    server.close(() => {
        logger.info('Server closed')
        process.exit(0)
    })

    // Force close after 30 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down')
        process.exit(1)
    }, 30000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

// Start server
let server
connectDB().then(async () => {
    // Create database indexes
    await createIndexes()
    
    server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`)
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
        logger.info(`Health check available at: http://localhost:${PORT}/health`)
    })
}).catch((error) => {
    logger.error('Failed to start server:', error)
    process.exit(1)
})

