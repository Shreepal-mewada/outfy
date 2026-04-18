import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

const testimonials = [
  {
    rating: 5,
    text: "I'm absolutely in love with this website. Every piece looks high quality and fits beautifully. The delivery was quick, and the packaging looked so elegant.",
    name: "Emma R.",
    role: "Verified Purchaser",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    rating: 5,
    text: "The designs are so elegant and trendy, exactly what I was looking for! From browsing to checkout, the entire shopping experience was smooth and enjoyable.",
    name: "John D.",
    role: "Verified Purchaser",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
  },
  {
    rating: 5,
    text: "This brand never disappoints! The collection blends premium yet affordable, and their customer support team is incredibly helpful with sizing recommendations.",
    name: "Sarah L.",
    role: "Verified Purchaser",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 md:px-22 bg-[#FAF8F5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
      >
        <div className="max-w-md">
          <h2 className="text-2xl font-serif text-[#1A1C19] mb-3">Fashion That Speaks for Itself</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Hear what our happy customers say about their shopping experience and styling styles that receive their well-loved fashion brand.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100"
          >
            <div className="flex gap-1 mb-4 text-[#827668]">
              {[...Array(testi.rating)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-8 italic">"{testi.text}"</p>
            <div className="flex items-center gap-3">
              <img src={testi.avatar} alt={testi.name} className="w-8 h-8 rounded-full border border-stone-200" />
              <div>
                <h4 className="text-xs font-semibold text-[#1A1C19]">{testi.name}</h4>
                <p className="text-[10px] text-stone-500">{testi.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
