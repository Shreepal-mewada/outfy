import dotenv from "dotenv";

dotenv.config();
const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/outfy",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "your_google_client_id",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret",
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "your_imagekit_private_key",
};  

export default config;
