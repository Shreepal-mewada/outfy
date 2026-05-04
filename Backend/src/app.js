import express from "express";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import router from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import paymentRouter from "./routes/payment.route.js";
import chatbotRouter from "./chatbot/chatbot.route.js";
import cookiePsrser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();
app.use(cookiePsrser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL.replace(/\/$/, "")]
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/products", router);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chatbot", chatbotRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");

});

export default app;
