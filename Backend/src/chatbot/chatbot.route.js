import express from "express";
import { handleMessage } from "./chatbot.controller.js";

const chatbotRouter = express.Router();

// POST /api/chatbot/message
chatbotRouter.post("/message", handleMessage);

export default chatbotRouter;
