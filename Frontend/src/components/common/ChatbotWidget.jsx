import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Send,
  Loader2,
  ShoppingBag,
  Bot,
  MessageCircle,
  X,
} from "lucide-react";
import { sendChatMessage } from "../../feature/chatbot/services/chatbot.api";

// Site theme
const THEME = {
  primary: "#1A1C19",       // deep charcoal — nav/buttons
  primaryHover: "#2d3028",  // slightly lighter charcoal
  accent: "#827668",        // warm stone — secondary text
  accentLight: "#F5F3F0",   // warm off-white background
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function FormattedMessage({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
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
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── Product Card inside chat ──────────────────────────────────────────────────
function ProductCard({ product }) {
  const price =
    product.finalPrice || product.priceAmount || product.originalPrice;
  const image = product.images?.[0]?.url || product.image || null;
  return (
    <a
      href={`/product/${product._id}`}
      className="flex items-center gap-3 p-2.5 bg-white border border-stone-100 hover:border-stone-300 hover:shadow-sm rounded-xl transition-all duration-200 group"
    >
      <div className="w-12 h-14 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden">
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
        <p className="text-[10px] text-[#827668] truncate capitalize">
          {product.category || product.gender || "Fashion"}
        </p>
        <h4 className="text-xs font-medium text-[#1A1C19] truncate leading-snug mt-0.5">
          {product.title}
        </h4>
        <p className="text-sm font-bold text-[#1A1C19] mt-0.5">
          ₹{price?.toLocaleString("en-IN")}
        </p>
      </div>
      <span className="text-[10px] font-medium text-[#827668] flex-shrink-0 group-hover:text-[#1A1C19] transition-colors">
        View →
      </span>
    </a>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isBot ? "justify-start" : "justify-end"} gap-2 px-4`}
    >
      {/* Bot avatar */}
      {isBot && (
        <div
          className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center mt-0.5 shadow-sm"
          style={{ background: THEME.primary }}
        >
          <Bot size={13} className="text-white" />
        </div>
      )}

      <div className={`max-w-[78%] ${isBot ? "" : "items-end"} flex flex-col`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm ${
            isBot
              ? "bg-white border border-stone-100 text-[#1A1C19] rounded-tl-sm"
              : "text-white rounded-tr-sm"
          }`}
          style={!isBot ? { background: THEME.primary } : {}}
        >
          {isBot ? <FormattedMessage text={msg.text} /> : <p>{msg.text}</p>}
        </div>

        {/* Timestamp */}
        {msg.time && (
          <span className="text-[10px] text-stone-400 mt-1 mx-1">
            {msg.time}
          </span>
        )}

        {/* Product cards */}
        {isBot && msg.products?.length > 0 && (
          <div className="mt-2 space-y-2 w-full">
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
                className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-stone-200 bg-[#F5F3F0] text-[#1A1C19] hover:bg-[#1A1C19] hover:text-white hover:border-[#1A1C19] transition-all duration-200 cursor-pointer"
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

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start gap-2 px-4">
      <div
        className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center shadow-sm"
        style={{ background: THEME.primary }}
      >
        <Bot size={13} className="text-white" />
      </div>
      <div className="bg-white border border-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
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
  text: "Hi! I'm **Outfy Assistant** — your personal shopping helper!\n\nHow can I help you today?",
  products: [],
  quickActions: INITIAL_QUICK_ACTIONS,
  time: getTime(),
};

// ─── Main Widget ──────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { id: Date.now(), role: "user", text: text.trim(), time: getTime() };
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
        time: getTime(),
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
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (value) => sendMessage(value);
  const handleSubmit = (e) => { e.preventDefault(); sendMessage(inputValue); };

  const messagesWithActions = messages.map((msg) =>
    msg.role === "bot" ? { ...msg, onQuickAction: handleQuickAction } : msg,
  );

  // ── Shared Chat Panel ────────────────────────────────────────────────────────
  const ChatPanel = (
    <div className="flex flex-col h-full bg-[#F5F3F0]">

      {/* ── Header ── */}
      <div className="flex-shrink-0 text-white shadow-md" style={{ background: THEME.primary }}>
        <div className="flex items-center gap-3 px-3 py-3">
          {/* Back button — mobile only */}
          <button
            onClick={() => setIsOpen(false)}
            className="sm:hidden p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center ring-2 ring-white/20">
              <Bot size={18} />
            </div>
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2"
              style={{ borderColor: THEME.primary }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold leading-tight tracking-wide">
              Outfy Assistant
            </p>
            <p className="text-[10px] text-white/60 leading-tight mt-0.5 uppercase tracking-widest">
              Online · Replies instantly
            </p>
          </div>

          {/* Desktop close */}
          <button
            onClick={() => setIsOpen(false)}
            className="hidden sm:flex p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Trust strip */}
        <div className="bg-black/20 px-4 py-1.5">
          <span className="text-[10px] text-white/50 tracking-wide">
            🔒 Secure · Powered by Outfy AI
          </span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {/* Date divider */}
        <div className="flex items-center gap-3 px-4">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-[10px] text-stone-400 whitespace-nowrap">Today</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {messagesWithActions.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* ── Input Bar ── */}
      <div className="flex-shrink-0 bg-white border-t border-stone-200 px-3 py-2 pb-[env(safe-area-inset-bottom,8px)]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message…"
            disabled={loading}
            className="flex-1 bg-stone-100 rounded-full px-4 py-2.5 text-[13px] text-[#1A1C19] placeholder:text-stone-400 outline-none transition-all disabled:opacity-60 focus:ring-2 focus:ring-[#1A1C19]/30"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all flex-shrink-0 shadow-md"
            style={{ background: THEME.primary }}
            aria-label="Send"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </form>
        <p className="text-center text-[9px] text-stone-300 uppercase tracking-widest mt-2">
          Powered by Outfy · Always here to help
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* ── FAB ── */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">
        {/* Desktop tooltip pill */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="hidden md:flex items-center gap-2 bg-white border border-stone-200 rounded-full pl-3 pr-4 py-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setIsOpen(true)}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: THEME.primary }}
              >
                <Bot size={12} className="text-white" />
              </div>
              <span className="text-[12px] font-medium text-[#1A1C19]">
                Need help?
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen((v) => !v)}
          className="rounded-full shadow-xl flex items-center justify-center text-white cursor-pointer relative transition-colors"
          style={{
            width: 52,
            height: 52,
            background: isOpen ? THEME.primaryHover : THEME.primary,
          }}
          aria-label="Open chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <MessageCircle size={22} />
              </motion.div>
            )}
          </AnimatePresence>

          {unread > 0 && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow"
            >
              {unread}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* MOBILE — full-screen slide-in */}
            <motion.div
              key="mobile-chat"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-0 z-50 sm:hidden"
            >
              {ChatPanel}
            </motion.div>

            {/* DESKTOP — floating panel */}
            <motion.div
              key="desktop-chat"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden sm:flex fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 flex-col"
              style={{ height: 540 }}
            >
              {ChatPanel}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
