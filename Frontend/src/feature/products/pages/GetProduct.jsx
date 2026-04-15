import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { motion } from "framer-motion";

function GetProduct() {
  const { handleGetProducts } = useProduct();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assumes Redux state shape has a products array slice.
  // Using a fallback for safety if Redux structure isn't entirely matched yet.
  const reduxProducts = useSelector((state) => state.product?.products || []);
  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await handleGetProducts();
        // If Redux is not fully piped, we can rely on local state from the response.
        if (res && res.products) {
          setLocalProducts(res.products);
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayProducts = reduxProducts.length > 0 ? reduxProducts : localProducts;

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[#1A1C19] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex justify-center">
        <p className="text-[11px] uppercase tracking-widest text-red-500">{error}</p>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center border border-dashed border-stone-300 rounded-3xl bg-white/50 backdrop-blur-sm">
        <h3 className="font-serif text-2xl text-[#1A1C19] mb-2">No products yet.</h3>
        <p className="text-[11px] uppercase tracking-widest text-stone-500">
          Your active listings will appear here.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
    >
      {displayProducts.map((product) => (
        <motion.div
          key={product._id || product.id}
          variants={itemVariants}
          className="group cursor-pointer flex flex-col"
        >
          {/* Image Container with Hover Effect */}
          <div className="relative w-full aspect-[3/4] bg-stone-100 mb-4 overflow-hidden rounded-lg">
            <img
              src={
                product.images?.[0] ||
                product.image ||
                "/outfy-fashion-model.png"
              }
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Minimal overlay on hover */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Product Details */}
          <h3 className="text-sm font-medium text-[#1A1C19] truncate mb-1">
            {product.title}
          </h3>
          <p className="text-[11px] uppercase tracking-widest text-stone-500 mb-2 truncate">
            {product.description || "No description"}
          </p>
          <div className="flex items-center text-sm text-[#1A1C19]">
            {product.priceCurrency || (product.price?.currency) || "INR"}
            <span className="ml-[2px]">{product.priceAmount || (product.price?.amount) || "0.00"}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default GetProduct;
