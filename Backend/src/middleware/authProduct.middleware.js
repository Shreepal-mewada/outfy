
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

export const authProduct = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const userId = decoded.id || decoded.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "seller") {
      return res
        .status(403)
        .json({ message: "buyer cannot access this route" });
    }

    req.user = user;

    // Authentication logic for product routes
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
