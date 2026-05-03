import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, ShoppingBag, Bot } from "lucide-react";
import { sendChatMessage } from "../../feature/chatbot/services/chatbot.api";

// ─── Markdown-lite renderer ──────────────────────────────────────────────────
// Converts **bold**, bullet points (•), and \n into styled spans/divs
function FormattedMessage({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold segments
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── Product Card inside chat ─────────────────────────────────────────────────
function ProductCard({ product }) {
  const price = product.finalPrice || product.priceAmount || product.originalPrice;
  const image = product.images?.[0]?.url || product.image || null;
  return (
    <a
      href={`/product/${product._id}`}
      className="flex items-center gap-3 p-2.5 bg-[#F5F3F0] hover:bg-stone-200 rounded-xl transition-colors group"
    >
      <div className="w-12 h-14 flex-shrink-0 bg-stone-200 rounded-lg overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={16} className="text-stone-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] uppercase tracking-widest text-[#827668] truncate">
          {product.category || product.gender}
        </p>
        <h4 className="text-xs font-medium text-[#1A1C19] truncate leading-snug">
          {product.title}
        </h4>
        <p className="text-xs font-bold text-[#1A1C19] mt-0.5">
          ₹{price?.toLocaleString("en-IN")}
        </p>
      </div>
      <span className="text-[9px] uppercase tracking-widest text-[#827668] flex-shrink-0">
        View →
      </span>
    </a>
  );
}

// ─── Individual Message Bubble ─────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isBot ? "justify-start" : "justify-end"} gap-2`}
    >
      {isBot && (
        <div className="w-7 h-7 flex-shrink-0 bg-[#1A1C19] rounded-full flex items-center justify-center mt-0.5">
          <Bot size={13} className="text-white" />
        </div>
      )}
      <div className={`max-w-[80%] ${isBot ? "" : "order-first"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[12px] leading-relaxed ${
            isBot
              ? "bg-white border border-stone-100 text-[#1A1C19] rounded-tl-sm shadow-sm"
              : "bg-[#1A1C19] text-white rounded-tr-sm"
          }`}
        >
          {isBot ? (
            <FormattedMessage text={msg.text} />
          ) : (
            <p>{msg.text}</p>
          )}
        </div>

        {/* Product cards */}
        {isBot && msg.products?.length > 0 && (
          <div className="mt-2 space-y-2">
            {msg.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {/* Quick action chips */}
        {isBot && msg.quickActions?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {msg.quickActions.map((action) => (
              <button
                key={action.value}
                onClick={() => msg.onQuickAction?.(action.value)}
                className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-[#1A1C19] hover:text-white hover:border-[#1A1C19] transition-all duration-200 text-stone-600 cursor-pointer"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Chatbot Widget ───────────────────────────────────────────────────────
const INITIAL_QUICK_ACTIONS = [
  { label: "📦 Track Order", value: "track my order" },
  { label: "🔄 Return / Exchange", value: "I want to return an item" },
  { label: "📏 Size Guide", value: "show me size guide" },
  { label: "💡 Product Suggestions", value: "suggest some products" },
  { label: "💳 Payment Issue", value: "I have a payment issue" },
  { label: "🎧 Contact Support", value: "I need to contact support" },
];

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "bot",
  text: "👋 Hi! I'm **Outfy Assistant** — your personal shopping helper!\n\nHow can I help you today?",
  products: [],
  quickActions: INITIAL_QUICK_ACTIONS,
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const data = await sendChatMessage(text.trim());

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: data.reply,
        products: data.products || [],
        quickActions: data.quickActions || INITIAL_QUICK_ACTIONS,
        onQuickAction: handleQuickAction,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen) setUnread((prev) => prev + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment. 🙏",
          products: [],
          quickActions: INITIAL_QUICK_ACTIONS,
          onQuickAction: handleQuickAction,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (value) => {
    sendMessage(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Attach onQuickAction to all bot messages so chips always work
  const messagesWithActions = messages.map((msg) =>
    msg.role === "bot" ? { ...msg, onQuickAction: handleQuickAction } : msg
  );

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip — desktop only */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="hidden md:block bg-white border border-stone-200 rounded-2xl px-4 py-2.5 shadow-lg text-[11px] text-[#1A1C19] tracking-wide whitespace-nowrap"
            >
              👋 Need help? Chat with us!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen((v) => !v)}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-[#1A1C19] rounded-full shadow-2xl flex items-center justify-center text-white cursor-pointer relative hover:bg-[#2d3028] transition-colors"
          style={{ width: 52, height: 52 }}
          aria-label="Open chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <MessageCircle size={20} />
              </motion.div>
            )}
          </AnimatePresence>

          {unread > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </motion.button>
      </div>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={
              // Mobile: fixed full-screen bottom sheet  |  sm+: floating panel
              "fixed z-50 bg-[#FAF9F7] border border-stone-200 shadow-2xl flex flex-col overflow-hidden " +
              "inset-x-0 bottom-0 rounded-t-3xl " +
              "sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:max-w-[420px] sm:rounded-3xl"
            }
            style={{ height: "min(90dvh, 560px)" }}
          >
            {/* Header */}
            <div className="bg-[#1A1C19] text-white px-5 py-4 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-wide">Outfy Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">Online · Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messagesWithActions.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start gap-2"
                >
                  <div className="w-7 h-7 flex-shrink-0 bg-[#1A1C19] rounded-full flex items-center justify-center">
                    <Bot size={13} className="text-white" />
                  </div>
                  <div className="bg-white border border-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-stone-200 px-3 py-3 flex-shrink-0 bg-white">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message…"
                  disabled={loading}
                  className="flex-1 bg-[#FAF9F7] border border-stone-200 rounded-full px-4 py-2.5 text-[12px] text-[#1A1C19] placeholder:text-stone-400 outline-none focus:border-[#1A1C19] transition-colors disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  className="w-10 h-10 bg-[#1A1C19] rounded-full flex items-center justify-center text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2d3028] transition-colors flex-shrink-0"
                  aria-label="Send"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </form>
              <p className="text-center text-[9px] text-stone-300 uppercase tracking-widest mt-2">
                Powered by Outfy · Always here to help
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
