import React from "react";
import { motion } from "framer-motion";
import { Truck, Headset, RotateCcw, Lock } from "lucide-react";

const features = [
  {
    title: "Free Shipping",
    description: "Shop into the realm of style with our unmatchable T-shirt translation of today.",
    icon: Truck,
  },
  {
    title: "24/7 Support",
    description: "Shop into the realm of style with our unmatchable T-shirt translation of today.",
    icon: Headset,
  },
  {
    title: "Easy Returns",
    description: "Shop into the realm of style with our unmatchable T-shirt translation of today.",
    icon: RotateCcw,
  },
  {
    title: "Secure Checkout",
    description: "Shop into the realm of style with our unmatchable T-shirt translation of today.",
    icon: Lock,
  },
];

const FeaturesRow = () => {
  return (
    <section className="py-12 px-6 md:px-22 bg-[#FAF8F5]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-y border-stone-200 py-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-4 text-[#827668] group-hover:text-[#1A1C19] transition-colors duration-300">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-[#1A1C19] mb-2">{feature.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-[200px]">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesRow;
