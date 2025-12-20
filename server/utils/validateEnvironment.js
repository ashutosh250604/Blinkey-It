import logger from './logger.js'

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET_KEY',
    'FRONTEND_URL',
    'RESEND_API'
]

const optionalEnvVars = [
    'PORT',
    'NODE_ENV',
    'LOG_LEVEL',
    'STRIPE_SECRET_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
]

export function validateEnvironment() {
    const missing = []
    const warnings = []

    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName)
        }
    })

    // Check optional but recommended variables
    optionalEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(varName)
        }
    })

    // Log warnings
    if (warnings.length > 0) {
        logger.warn(`Optional environment variables not set: ${warnings.join(', ')}`)
    }

    // Throw error if required variables are missing
    if (missing.length > 0) {
        const errorMessage = `Missing required environment variables: ${missing.join(', ')}`
        logger.error(errorMessage)
        throw new Error(errorMessage)
    }

    // Validate specific formats
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
        throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://')
    }

    if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('http')) {
        throw new Error('FRONTEND_URL must be a valid HTTP/HTTPS URL')
    }

    logger.info('Environment validation passed')
}

export default validateEnvironment
