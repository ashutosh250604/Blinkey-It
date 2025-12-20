import winston from 'winston'

const { combine, timestamp, printf, colorize, errors } = winston.format

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
})

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp, stack }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
        })
    ),
    transports: [
        // Write all logs to console in development
        new winston.transports.Console({
            format: combine(
                colorize(),
                consoleFormat
            )
        }),
        // Write all logs with level 'error' to error.log
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs to combined.log
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ],
    // Don't exit on handled exceptions
    exitOnError: false
})

// If we're in production, don't log to console
if (process.env.NODE_ENV === 'production') {
    logger.remove(logger.transports.find(t => t.name === 'console'))
}

export default logger
