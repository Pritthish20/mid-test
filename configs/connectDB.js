import mongoose from "mongoose";
import { env } from "./envSchema.js";

const connectDB=async()=>{
    try {
        mongoose.connect(env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log("Error connecting MongoDB",error);
        process.exit(1);
    }
}

export default connectDB