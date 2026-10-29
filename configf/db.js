import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const connectionString = process.env.Mongodb_URL;
    if (!connectionString) {
      throw new Error("Mongodb_URL is not configured");
    }

    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}
export default connectDB;