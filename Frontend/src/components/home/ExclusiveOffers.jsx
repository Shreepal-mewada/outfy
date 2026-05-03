import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const ExclusiveOffers = () => {
  return (
    <section className="py-24 px-6 md:px-22 bg-[#FAF8F5]">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-24">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-md"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-[#1A1C19] leading-tight mb-6">
            Exclusive Offers for <br className="hidden md:block" /> a Limited
            Time
          </h2>
          <p className="text-sm text-stone-500 mb-8 leading-relaxed">
            Modern and stylish fashion store website design with a clean layout
            and elegant product showcase.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="bg-[#827668] text-white text-[11px] uppercase tracking-widest py-3.5 px-8 rounded-full hover:bg-[#6c6155] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Shop Now
            </Link>
            <Link
              to="/"
              className="border border-[#1A1C19] text-[#1A1C19] text-[11px] uppercase tracking-widest py-3.5 px-8 rounded-full hover:bg-[#1A1C19] hover:text-white transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex-1 w-full"
        >
          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/5 z-10 pointer-events-none"></div>
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
              alt="Exclusive Offers"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105 filter sepia-[0.1] contrast-[0.9]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;
