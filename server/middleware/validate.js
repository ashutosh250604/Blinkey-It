import Joi from 'joi'
import logger from '../utils/logger.js'

// Validation middleware factory
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        })

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }))

            logger.warn('Validation failed:', { errors, path: req.path })

            return res.status(400).json({
                message: 'Validation failed',
                error: true,
                success: false,
                errors: errors
            })
        }

        // Replace request body with validated and sanitized data
        req.body = value
        next()
    }
}

// Common validation schemas
export const schemas = {
    // User schemas
    register: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    forgotPassword: Joi.object({
        email: Joi.string().email().required()
    }),

    resetPassword: Joi.object({
        email: Joi.string().email().required(),
        newPassword: Joi.string().min(8).max(100).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    }),

    updateUser: Joi.object({
        name: Joi.string().min(2).max(50),
        mobile: Joi.string().pattern(/^[0-9]{10}$/),
        avatar: Joi.string().uri()
    }),

    // Product schemas
    createProduct: Joi.object({
        name: Joi.string().min(2).max(200).required(),
        image: Joi.array().items(Joi.string().uri()).min(1).required(),
        category: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
        subCategory: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
        unit: Joi.string().required(),
        stock: Joi.number().integer().min(0).default(0),
        price: Joi.number().positive().required(),
        discount: Joi.number().min(0).max(100).default(0),
        description: Joi.string().max(1000).required(),
        more_details: Joi.object()
    }),

    // Cart schemas
    addToCart: Joi.object({
        productId: Joi.string().hex().length(24).required()
    }),

    updateCartQty: Joi.object({
        _id: Joi.string().hex().length(24).required(),
        qty: Joi.number().integer().min(1).max(100).required()
    }),

    // Address schemas
    createAddress: Joi.object({
        address_line: Joi.string().max(200).required(),
        city: Joi.string().max(100).required(),
        state: Joi.string().max(100).required(),
        pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
        country: Joi.string().max(100).required(),
        mobile: Joi.string().pattern(/^[0-9]{10}$/).required()
    }),

    // Order schemas
    createOrder: Joi.object({
        list_items: Joi.array().min(1).required(),
        totalAmt: Joi.number().positive().required(),
        subTotalAmt: Joi.number().positive().required(),
        addressId: Joi.string().hex().length(24).required()
    })
}

export default validate
