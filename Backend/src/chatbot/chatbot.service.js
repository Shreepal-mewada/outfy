import ProductModel from "../models/product.model.js";

// ─── Static reply templates ───────────────────────────────────────────────────
const REPLIES = {
  track_order: `📦 To track your order:\n\n1. Go to your Orders section\n2. Click on the specific order\n3. View real-time tracking info\n\nIf you don't see an update within 24 hrs of placing the order, please contact our support team.`,

  return_exchange: `🔄 Our Return & Exchange Policy:\n\n• Returns accepted within **7 days** of delivery\n• Item must be unused, unwashed, and have original tags\n• Initiate a return from your Orders section\n• Refunds are processed within **5–7 business days**\n\nNeed help with a specific order? Please share your Order ID.`,

  size_guide: `📏 Outfy Size Guide:\n\n**Tops / T-Shirts:**\n• XS → Chest: 32–34"\n• S  → Chest: 34–36"\n• M  → Chest: 36–38"\n• L  → Chest: 38–40"\n• XL → Chest: 40–42"\n• XXL → Chest: 42–44"\n\n**Bottoms:**\n• 28 → Waist: 28"\n• 30 → Waist: 30"\n• 32 → Waist: 32"\n• 34 → Waist: 34"\n• 36 → Waist: 36"\n\nWhen in doubt, size up! 😊`,

  payment_issue: `💳 Payment Issues?\n\nIf money was deducted but order wasn't placed:\n• It will be auto-refunded in **3–5 business days**\n• If not, contact your bank with the Transaction ID\n\nFor payment failures:\n• Try a different payment method\n• Ensure your card/UPI is enabled for online transactions\n• Clear browser cache and retry\n\nStill stuck? Contact our support team.`,

  contact_support: `🎧 Reach Outfy Support:\n\n• 📧 Email: support@outfy.in\n• 📞 Phone: +91-9999-000-123\n• ⏰ Hours: Mon–Sat, 9am–6pm IST\n\nOr I can help you right here! Just tell me what you need. 😊`,

  fallback: `👋 Hi! I'm **Outfy Assistant** — here to help you with your shopping experience!\n\nI can help you with:\n• 📦 Order Tracking\n• 🔄 Returns & Exchanges\n• 📏 Size Guide\n• 💡 Product Suggestions\n• 💳 Payment Issues\n• 🎧 Contact Support\n\nWhat would you like help with today?`,
};

const QUICK_ACTIONS = [
  { label: "📦 Track Order", value: "track my order" },
  { label: "🔄 Return / Exchange", value: "I want to return" },
  { label: "📏 Size Guide", value: "show me size guide" },
  { label: "💡 Product Suggestions", value: "suggest products for me" },
  { label: "💳 Payment Issue", value: "I have a payment issue" },
  { label: "🎧 Contact Support", value: "I need to contact support" },
];

// ─── Product search helper ────────────────────────────────────────────────────
async function searchProductsForSuggestion(message) {
  try {
    const lower = message.toLowerCase();
    const query = { isActive: true };

    // Gender detection
    if (lower.includes("men") && !lower.includes("women")) query.gender = "Men";
    else if (lower.includes("women")) query.gender = "Women";
    else if (lower.includes("kids") || lower.includes("children")) query.gender = "Kids";
    else if (lower.includes("unisex")) query.gender = "Unisex";

    // Category / keyword detection
    const categoryKeywords = [
      "shirt", "t-shirt", "tshirt", "top", "dress", "jeans", "trouser",
      "pant", "jacket", "hoodie", "sweatshirt", "kurta", "kurti", "saree",
      "lehenga", "co-ord", "formal", "ethnic", "western", "casual", "party",
    ];
    const matched = categoryKeywords.find((kw) => lower.includes(kw));
    if (matched) {
      query.title = { $regex: matched, $options: "i" };
    }

    // Price range detection
    const priceMatch = lower.match(/under\s*(?:rs\.?|inr)?\s*(\d+)/i);
    if (priceMatch) {
      query.finalPrice = { $lte: parseInt(priceMatch[1]) };
    }
    const budgetMatch = lower.match(/below\s*(?:rs\.?|inr)?\s*(\d+)/i);
    if (budgetMatch) {
      query.finalPrice = { $lte: parseInt(budgetMatch[1]) };
    }

    const products = await ProductModel.find(query)
      .limit(4)
      .select("title images finalPrice priceAmount originalPrice category gender discountPercentage currency");

    return products;
  } catch (err) {
    console.error("Chatbot product search error:", err);
    return [];
  }
}

// ─── Main service function ────────────────────────────────────────────────────
export async function generateChatbotResponse(intent, message) {
  let reply = REPLIES[intent] || REPLIES.fallback;
  let products = [];
  let quickActions = QUICK_ACTIONS;

  if (intent === "product_suggestion") {
    products = await searchProductsForSuggestion(message);
    if (products.length > 0) {
      reply = `✨ Here are some Outfy picks for you! Tap any product to view details.`;
    } else {
      reply = `🛍️ I couldn't find exact matches, but you can browse our full collection!\n\nTry searching with specific keywords like "women's dress under 1000" or "men's formal shirt".`;
    }
    // After product suggestion, show fewer actions
    quickActions = [
      { label: "🔍 Browse All Products", value: "show me all products" },
      { label: "💡 More Suggestions", value: "suggest more products" },
      { label: "📦 Track Order", value: "track my order" },
      { label: "🎧 Contact Support", value: "I need to contact support" },
    ];
  }

  return { reply, products, quickActions };
}
