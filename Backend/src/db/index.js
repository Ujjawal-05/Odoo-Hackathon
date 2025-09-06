import mongoose from 'mongoose'
import { DB_NAME } from '../Constant/dbname.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`);
        console.log(`Database connected: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

export { connectDB }