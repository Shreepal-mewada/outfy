import express from "express";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";

connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
