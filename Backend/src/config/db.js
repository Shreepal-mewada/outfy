import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {

 if(!config.MONGO_URI){
    console.error("MONGO_URI is not defined in environment variables");
    throw new Error("MONGO_URI is not defined in environment variables");
  }


  try {
    await mongoose.connect(config.MONGO_URI).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  } 
};

export default connectDB;
