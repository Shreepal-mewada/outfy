import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const { email, contact, fullname, password, isSeller } = req.body;
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }
    const newUser = await userModel.create({
      email,
      password,
      fullname,
      contact,
      role: isSeller ? "seller" : "buyer",
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullname: newUser.fullname,
        contact: newUser.contact,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function loginUser(req, res) {
  // Implement login logic here
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        contact: user.contact,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function googleAuth(req, res) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!googleRes.ok) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const userData = await googleRes.json();
    const { email, name } = userData;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        fullname: name,
        authProvider: "google",
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", jwtToken);
    res.status(200).json({
      message: "Google Login successful",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        contact: user.contact,
        role: user.role,
      },
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
