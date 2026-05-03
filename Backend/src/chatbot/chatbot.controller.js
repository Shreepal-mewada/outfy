import { detectIntent } from "./chatbot.intents.js";
import { generateChatbotResponse } from "./chatbot.service.js";

/**
 * POST /api/chatbot/message
 * Body: { message: string }
 */
export async function handleMessage(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const intent = detectIntent(message.trim());
    const { reply, products, quickActions } = await generateChatbotResponse(intent, message.trim());

    return res.status(200).json({
      success: true,
      intent,
      reply,
      products,
      quickActions,
    });
  } catch (error) {
    console.error("Chatbot controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
}
