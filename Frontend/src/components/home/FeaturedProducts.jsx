import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const featuredProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",
    name: "Pink Flow Dress",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    name: "Classic Khaki Jacket",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80",
    name: "Emerald Two-Piece",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    name: "Urban Cargo Pants",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-24 px-6 md:px-22 bg-[#FAF8F5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
      >
        <div className="max-w-md">
          <h2 className="text-2xl font-serif text-[#1A1C19] mb-3">Featured Products</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Modern and stylish fashion store website design with a clean layout and elegant product showcase.
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold border border-stone-300 py-3 px-6 rounded-full hover:bg-stone-100 transition-colors shrink-0"
        >
          See all 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-200 shadow-sm border border-stone-100 mb-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
