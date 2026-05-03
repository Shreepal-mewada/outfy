// ─── Intent keyword map ───────────────────────────────────────────────────────
// Each key is an intent name; value is an array of regex-friendly keywords.
export const INTENTS = {
  track_order: [
    "track", "order status", "where is my order", "delivery status",
    "shipped", "dispatch", "out for delivery", "package", "parcel",
    "when will", "expected delivery", "ETA", "estimated",
  ],
  return_exchange: [
    "return", "exchange", "refund", "replace", "damaged", "wrong product",
    "wrong size", "defective", "cancel order", "cancellation", "money back",
    "size issue", "not satisfied",
  ],
  size_guide: [
    "size", "fit", "sizing", "measurement", "what size", "which size",
    "size chart", "size guide", "too big", "too small", "how to measure",
    "size recommend",
  ],
  product_suggestion: [
    "suggest", "recommend", "show me", "find", "looking for", "need a",
    "want a", "dress", "shirt", "jeans", "top", "jacket", "kurta", "saree",
    "trouser", "pant", "t-shirt", "tshirt", "kurti", "lehenga", "co-ord",
    "hoodie", "sweatshirt", "formal", "casual", "party", "ethnic", "western",
    "men", "women", "kids", "unisex", "under", "below", "budget",
  ],
  payment_issue: [
    "payment", "pay", "transaction", "failed", "charged", "deducted",
    "not credited", "bank", "upi", "razorpay", "card", "net banking",
    "wallet", "double charge", "refund not received", "money deducted",
  ],
  contact_support: [
    "contact", "support", "help", "agent", "human", "talk to someone",
    "customer care", "call", "email", "complaint", "grievance",
    "speak to", "connect me",
  ],
};

/**
 * Detect intent from a plain-text message.
 * Returns the first matched intent key, or "fallback".
 */
export function detectIntent(message) {
  const lower = message.toLowerCase();

  for (const [intent, keywords] of Object.entries(INTENTS)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return intent;
    }
  }

  return "fallback";
}
