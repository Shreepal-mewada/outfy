import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const categories = [
  {
    title: "GIRLS",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&q=80",
    link: "/category/girls",
  },
  {
    title: "MEN",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80",
    link: "/category/men",
  },
  {
    title: "WOMEN",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
    link: "/category/women",
  },
  {
    title: "KIDS",
    image: "https://images.unsplash.com/photo-1519238396346-630e665977a4?w=500&q=80",
    link: "/category/kids",
  },
];

const CategoriesGrid = () => {
  return (
    <section className="py-24 px-6 md:px-22 bg-[#FAF8F5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-serif text-[#1A1C19] mb-3">Categories</h2>
        <p className="text-xs text-stone-500">Perfect for clothing brands, boutiques, and online fashion shops.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <Link to={cat.link} className="relative block aspect-[3/4] group overflow-hidden rounded-2xl bg-stone-200">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              <div className="absolute bottom-6 w-full text-center">
                <span className="inline-block bg-white/90 backdrop-blur-sm text-[#1A1C19] text-[10px] font-bold uppercase tracking-widest py-2 px-6 rounded-full shadow-sm transform transition-transform duration-300 group-hover:-translate-y-1">
                  {cat.title}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesGrid;
