import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async (): Promise<void> => {
  try {
    const environment = process.env.MODE_ENV || process.env.NODE_ENV || "development";
    const uriVariable =
      environment === "production" ? "MONGODB_URI_PROD" : "MONGODB_URI_DEV";
    const mongoURI = process.env[uriVariable]?.trim();

    if (!mongoURI) {
      throw new Error(
        `${uriVariable} is not defined in the environment variables`
      );
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error connecting to MongoDB:", errorMessage);
    throw error;
  }
};

export default connectDB;
