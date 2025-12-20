import mongoose from 'mongoose'
import logger from '../utils/logger.js'

// Function to create indexes on all models
export async function createIndexes() {
    try {
        const db = mongoose.connection.db
        
        // User model indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true })
        await db.collection('users').createIndex({ status: 1 })
        await db.collection('users').createIndex({ role: 1 })
        await db.collection('users').createIndex({ verify_email: 1 })
        await db.collection('users').createIndex({ createdAt: -1 })
        
        // Product model indexes
        await db.collection('products').createIndex({ name: 'text', description: 'text' })
        await db.collection('products').createIndex({ category: 1 })
        await db.collection('products').createIndex({ subCategory: 1 })
        await db.collection('products').createIndex({ price: 1 })
        await db.collection('products').createIndex({ publish: 1 })
        await db.collection('products').createIndex({ createdAt: -1 })
        // Note: Cannot create compound index on two array fields (category, subCategory)
        // MongoDB limitation: "parallel arrays" not supported
        
        // Category model indexes
        await db.collection('categories').createIndex({ name: 1 }, { unique: true })
        
        // SubCategory model indexes
        await db.collection('subcategories').createIndex({ name: 1 })
        await db.collection('subcategories').createIndex({ category: 1 })
        
        // Cart model indexes
        await db.collection('cartproducts').createIndex({ userId: 1 })
        await db.collection('cartproducts').createIndex({ productId: 1 })
        await db.collection('cartproducts').createIndex({ userId: 1, productId: 1 }, { unique: true })
        
        // Order model indexes
        await db.collection('orders').createIndex({ userId: 1 })
        await db.collection('orders').createIndex({ orderId: 1 }, { unique: true })
        await db.collection('orders').createIndex({ payment_status: 1 })
        await db.collection('orders').createIndex({ createdAt: -1 })
        await db.collection('orders').createIndex({ userId: 1, createdAt: -1 })
        
        // Address model indexes
        await db.collection('addresses').createIndex({ userId: 1 })
        
        logger.info('Database indexes created successfully')
    } catch (error) {
        logger.error('Error creating indexes:', error)
        throw error
    }
}

export default createIndexes
