import mongoose from "mongoose";
import dotenv from 'dotenv'
import logger from '../utils/logger.js'
dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        logger.info("Database connected successfully")
    } catch (error) {
        logger.error("MongoDB connection error:", error)
        process.exit(1)
    }
}

export default connectDB