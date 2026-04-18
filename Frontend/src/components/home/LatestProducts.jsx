import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const products = [
  {
    id: 1,
    name: "T-Shirt Short",
    price: "$ 890.98 USD",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80",
  },
  {
    id: 2,
    name: "Short-Sleeved Shirts",
    price: "$ 912.98 USD",
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80",
  },
  {
    id: 3,
    name: "Sleeved Shirts with Inner",
    price: "$ 629.98 USD",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80",
  },
];

const LatestProducts = () => {
  return (
    <section className="py-24 px-6 md:px-22 bg-[#FAF8F5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-serif text-[#1A1C19] mb-12">Latest Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-2xl bg-stone-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-sm font-semibold text-[#1A1C19] mb-1">{product.name}</h3>
              <p className="text-xs text-stone-500 mb-3">{product.price}</p>
              <button className="text-[11px] uppercase tracking-widest text-[#827668] hover:text-[#1A1C19] transition-colors relative inline-block group/btn">
                Add to Cart <span className="ml-1 transition-transform group-hover/btn:translate-x-1 inline-block">→</span>
                <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover/btn:w-full"></span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default LatestProducts;
