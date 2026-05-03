import axios from "axios";

const chatbotInstance = axios.create({
  baseURL: "http://localhost:3000/api/chatbot",
  withCredentials: true,
});

export const sendChatMessage = async (message) => {
  try {
    const response = await chatbotInstance.post("/message", { message });
    return response.data;
  } catch (error) {
    console.error("Chatbot API error:", error);
    throw error;
  }
};
