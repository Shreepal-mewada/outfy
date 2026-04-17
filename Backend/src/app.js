import express from "express";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import router from "./routes/product.route.js";
import cookiePsrser from "cookie-parser";
import cors from "cors";

connectDB();

const app = express();
app.use(cookiePsrser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/products", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
