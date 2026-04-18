import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Leather Jacket",
    price: "$ 890.00 USD",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    id: 2,
    name: "Lace Midi Skirt",
    price: "$ 460.00 USD",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    id: 3,
    name: "Minimalist Blazer",
    price: "$ 720.00 USD",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  },
  {
    id: 4,
    name: "Snake Print Coat",
    price: "$ 1,120.00 USD",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
  },
  {
    id: 5,
    name: "Black Mini Dress",
    price: "$ 540.00 USD",
    image:
      "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600&q=80",
  },
  {
    id: 6,
    name: "Fringe Skirt",
    price: "$ 670.00 USD",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  },
  {
    id: 7,
    name: "Denim Jacket",
    price: "$ 480.00 USD",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
  },
];

const N = products.length;
const mod = (n, m) => ((n % m) + m) % m;

// Config per distance from center
const CARD_CONFIG = {
  0: { w: 280, h: 460, opacity: 1, brightness: 1, zIndex: 20 },
  1: { w: 180, h: 390, opacity: 0.92, brightness: 0.88, zIndex: 15 },
  2: { w: 130, h: 325, opacity: 0.75, brightness: 0.72, zIndex: 10 },
  3: { w: 90, h: 270, opacity: 0.5, brightness: 0.58, zIndex: 5 },
};

// SLOT_X: pre-calculated center x per dist (widths + 12px gap)
// dist ±1: 280/2 + 12 + 180/2 = 242
// dist ±2: 242 + 180/2 + 12 + 130/2 = 409
// dist ±3: 409 + 130/2 + 12 + 90/2 = 531
//242 409 531
const SLOT_X = {
  0: 0,
  1: 225,
  "-1": -225,
  2: 374,
  "-2": -374,
  3: 480,
  "-3": -480,
};

// Compute signed shortest-path distance from activeIndex
const getDist = (index, activeIndex) => {
  let d = index - activeIndex;
  if (d > Math.floor(N / 2)) d -= N;
  if (d < -Math.floor(N / 2)) d += N;
  return d;
};

const LatestProducts = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => mod(i - 1, N));
  const next = () => setActiveIndex((i) => mod(i + 1, N));
  const goTo = (i) => setActiveIndex(i);

  const activeProduct = products[activeIndex];

  return (
    <motion.section
      className="py-24 bg-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9 }}
    >
      {/* ── Title ── */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <h2
          className="text-3xl md:text-4xl font-bold tracking-[0.18em] text-[#1A1C19] uppercase"
          style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
        >
          Featured Collection
        </h2>
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="h-px w-12 bg-[#1A1C19]/20" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#827668]">
            New Arrivals
          </span>
          <span className="h-px w-12 bg-[#1A1C19]/20" />
        </div>
      </motion.div>

      {/* ── Carousel Stage ── */}
      <div
        className="relative flex justify-center select-none"
        style={{ height: 480 }}
      >
        {products.map((product, index) => {
          const dist = getDist(index, activeIndex);
          const absDist = Math.abs(dist);
          const isVisible = absDist <= 3;
          const config = CARD_CONFIG[Math.min(absDist, 3)];
          // Pure pixel x: SLOT_X center position minus half card width — no percentage transforms
          const slotCenter = SLOT_X[dist] ?? (dist > 0 ? 700 : -700);
          const x = slotCenter - config.w / 2;
          const isCenter = dist === 0;

          return (
            <motion.div
              key={product.id}
              animate={{
                x,
                width: config.w,
                height: config.h,
                opacity: isVisible ? config.opacity : 0,
                filter: `brightness(${config.brightness})`,
                zIndex: isVisible ? config.zIndex : 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94], // smooth ease-out-quart
              }}
              onClick={() => {
                if (!isCenter) goTo(index);
              }}
              className={`absolute bottom-0 rounded-xl overflow-hidden
                ${isCenter ? "shadow-2xl cursor-default" : "shadow-md cursor-pointer hover:opacity-90"}
              `}
              style={{ left: "50%" }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ── Controls: Arrows + Cart ── */}
      <div className="flex flex-col items-center mt-10 gap-5">
        <div className="flex items-center gap-15">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-stone-300 bg-white text-[#1A1C19]
              flex items-center justify-center hover:bg-[#1A1C19] hover:text-white
              hover:border-[#1A1C19] transition-all duration-200 shadow-sm"
          >
            <ChevronLeft size={17} />
          </button>

          <button
            className="w-10 h-10 rounded-full bg-[#1A1C19] text-white flex items-center
            justify-center shadow-md hover:bg-[#827668] transition-colors duration-200"
          >
            <ShoppingCart size={15} />
          </button>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-stone-300 bg-white text-[#1A1C19]
              flex items-center justify-center hover:bg-[#1A1C19] hover:text-white
              hover:border-[#1A1C19] transition-all duration-200 shadow-sm"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Active Product Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            className="text-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#1A1C19]">
              {activeProduct.name}
            </p>
            <p className="text-xs text-[#827668] mt-1 tracking-widest">
              {activeProduct.price}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Dot Indicators ── */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-500 ${
              i === activeIndex
                ? "w-7 h-1.5 bg-[#1A1C19]"
                : "w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400"
            }`}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default LatestProducts;
