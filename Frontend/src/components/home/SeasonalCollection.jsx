import React from "react";
import { motion } from "framer-motion";

const SeasonalCollection = () => {
  return (
    <section className="py-24 px-6 md:px-22 bg-[#FAF8F5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-serif text-[#1A1C19] mb-3">Seasonal Collection</h2>
        <p className="text-xs text-stone-500">
          Modern and stylish fashion store website design with a clean layout and elegant product showcase.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
        <img
          src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80"
          alt="Seasonal Collection Clothing Rack"
          className="w-full h-full object-cover grayscale-[20%] contrast-[1.1] filter"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-12 py-5 rounded-full shadow-lg transform transition-transform hover:scale-105 pointer-events-auto cursor-pointer">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#1A1C19]">
              Winter
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SeasonalCollection;
