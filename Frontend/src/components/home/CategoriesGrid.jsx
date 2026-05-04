import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    title: "Kids",
    subtitle: "For everyone",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80",
    link: "/products?category=Kids",
  },
  {
    title: "Men",
    subtitle: "Sharp & refined",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
    link: "/products?category=Men",
  },
  {
    title: "Women",
    subtitle: "Effortlessly chic",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    link: "/products?category=Women",
  },
  {
    title: "Unisex",
    subtitle: "Playful & bright",
    image: "/outfy_unisex.png",
    link: "/products?category=Unisex",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const CategoriesGrid = () => {
  return (
    <section className="py-24 px-6 md:px-16 bg-[#FAF8F5]">
      {/* ── Section Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="mb-14"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.55em] text-[#827668] mb-3">
              Browse by
            </p>
            <h2
              className="text-3xl md:text-4xl font-semibold uppercase tracking-[0.1em] text-[#1A1C19] font-BlinkMacSystemFont"
              // style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.4em]
              text-[#827668] hover:text-[#1A1C19] transition-colors duration-300 group pb-1"
          >
            View all
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
        <div className="h-px w-full bg-[#1A1C19]/8 mt-8" />
      </motion.div>

      {/* ── Bento Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-3 md:gap-4"
        style={{ height: "clamp(460px, 60vw, 700px)" }}
      >
        {/* Large card (col 1, spans 2 rows) */}
        <motion.div variants={cardVariants} className="row-span-2">
          <CategoryCard cat={categories[0]} tall />
        </motion.div>

        {/* Top-right card */}
        <motion.div variants={cardVariants} className="col-span-1">
          <CategoryCard cat={categories[1]} />
        </motion.div>

        {/* Middle-right spanning 2 cols */}
        <motion.div variants={cardVariants} className="col-span-1">
          <CategoryCard cat={categories[2]} />
        </motion.div>

        {/* Bottom row spanning 2 cols */}
        <motion.div variants={cardVariants} className="col-span-2">
          <CategoryCard cat={categories[3]} wide />
        </motion.div>
      </motion.div>
    </section>
  );
};

const CategoryCard = ({ cat, tall = false, wide = false }) => (
  <Link
    to={cat.link}
    className="relative block w-full h-full group overflow-hidden rounded-2xl bg-stone-100"
  >
    {/* Image */}
    <img
      src={cat.image}
      alt={cat.title}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      style={{ objectPosition: wide ? "center 30%" : "center top" }}
    />

    {/* Dark gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent transition-opacity duration-500" />

    {/* Text content */}
    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between">
      <div>
        <p className="text-[9px] uppercase tracking-[0.55em] text-white/60 mb-1.5 font-light">
          {cat.subtitle}
        </p>
        <h3
          className="text-white text-xl md:text-2xl font-bold uppercase tracking-[0.1em]"
          style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
        >
          {cat.title}
        </h3>
      </div>

      {/* Arrow icon */}
      <div
        className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center
          text-white/70 group-hover:bg-white group-hover:text-[#1A1C19] group-hover:border-white
          transition-all duration-300 group-hover:scale-110"
      >
        <ArrowUpRight size={15} />
      </div>
    </div>

    {/* Subtle left accent line on hover */}
    <div
      className="absolute left-0 top-6 bottom-6 w-[2px] bg-white/0 group-hover:bg-white/60
        transition-all duration-500 rounded-full"
    />
  </Link>
);

export default CategoriesGrid;
