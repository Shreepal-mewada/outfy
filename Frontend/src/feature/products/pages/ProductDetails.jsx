import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { ArrowLeft, Edit2, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const { handleGetProductById, isLoading, error } = useProduct();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await handleGetProductById(id);
        if (data && data.product) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id, handleGetProductById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A1C19] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">{error || "Product not found."}</p>
        <Link to="/seller" className="text-[#827668] underline text-sm">Return to Dashboard</Link>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images.map(i => i.url || i)
    : ["/outfy-fashion-model.png"];

  const hasDiscount = product.discountPercentage > 0;
  const currency = product.currency || "INR";

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1C19] font-sans">
      
      {/* Top Navbar */}
      <nav className="border-b border-[#EAE8E3] bg-white sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <Link to="/seller" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#827668] hover:text-[#1A1C19] transition-colors font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
          Seller Preview Mode
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="aspect-[4/5] sm:aspect-square md:aspect-[4/5] bg-[#EAE8E3] rounded-2xl md:rounded-[2rem] overflow-hidden relative shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  alt={product.title}
                />
              </AnimatePresence>
            </motion.div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === idx ? "border-[#1A1C19] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col pt-4 lg:pt-10"
          >
            {/* Brand / Category */}
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#827668] mb-4 flex items-center gap-2">
              <span>{product.brandName || "Outfy Originals"}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300"></span>
              <span>{product.category || "General"}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl lg:text-5xl tracking-tighter leading-tight mb-6 text-[#1A1C19]">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-stone-500 mb-8 leading-relaxed font-light text-sm">
              {product.description}
            </p>

            {/* Pricing Matrix */}
            <div className="mb-10 space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold tracking-tight">
                  {currency} {product.finalPrice || Math.round(product.originalPrice - (product.originalPrice * (product.discountPercentage / 100)))}
                </span>
                {hasDiscount && (
                  <span className="bg-[#1A1C19] text-white text-[10px] font-bold px-2 py-1 rounded">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-stone-400 font-medium line-through">
                  {currency} {product.originalPrice}
                </span>
              )}
            </div>

            {/* Sizes Array Renderer */}
            {product.sizes && product.sizes.length > 0 && (
               <div className="mb-10">
                 <h4 className="text-[10px] uppercase tracking-widest text-[#827668] font-bold mb-3">Available Sizes</h4>
                 <div className="flex flex-wrap gap-3">
                   {product.sizes.map((s, idx) => (
                     <div key={idx} className={`border px-4 py-2 rounded-lg text-sm font-medium ${s.stock > 0 ? "border-[#1A1C19] text-[#1A1C19] bg-white" : "border-stone-200 text-stone-300 bg-stone-50"}`}>
                       {s.size} <span className="ml-2 text-[10px] opacity-60">({s.stock} left)</span>
                     </div>
                   ))}
                 </div>
               </div>
            )}

            {/* Seller "Edit" Action (Replacing Add to Cart) */}
            <div className="flex items-center gap-4 border-t border-[#EAE8E3] pt-8">
              <Link 
                to={`/seller/edit/${product._id}`}
                className="flex-1 bg-[#1A1C19] text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#827668] transition-colors shadow-xl shadow-stone-200"
              >
                <Edit2 className="w-4 h-4" /> Edit Listing
              </Link>
            </div>
            
          </motion.div>
        </div>

        {/* Specifications Roll-up Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-24 border-t border-[#EAE8E3] pt-16"
        >
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl tracking-tighter italic text-[#1A1C19]">Specifications</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#827668] mt-2 font-bold">All Listed Attributes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Characteristics */}
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-widest text-[#827668] font-bold border-b border-[#EAE8E3] pb-2">Characteristics</h4>
              <ul className="space-y-4 text-sm font-medium text-[#1A1C19]">
                <li className="flex justify-between">
                  <span className="text-stone-400">Gender</span>
                  <span>{product.gender || "Unisex"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-stone-400">Fit</span>
                  <span>{product.fit || "Standard"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-stone-400">Pattern</span>
                  <span>{product.pattern || "Solid"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-stone-400">Sleeve</span>
                  <span>{product.sleeveType || "Standard"}</span>
                </li>
              </ul>
            </div>

            {/* Material & Occasion */}
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-widest text-[#827668] font-bold border-b border-[#EAE8E3] pb-2">Material</h4>
              <ul className="space-y-4 text-sm font-medium text-[#1A1C19]">
                <li className="flex justify-between">
                  <span className="text-stone-400">Fabric</span>
                  <span>{product.fabric || "Not Specified"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-stone-400">Occasion</span>
                  <span className="text-right">{product.occasion?.length ? product.occasion.join(", ") : "Casual"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-stone-400">Tags</span>
                  <span className="text-right max-w-[120px] truncate">{product.tags?.length ? product.tags.join(", ") : "None"}</span>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-stone-200">
               <h4 className="text-[10px] uppercase tracking-widest text-[#827668] font-bold">Policies & Instructions</h4>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                 <div className="flex gap-4 items-start">
                   <ShieldCheck className="w-5 h-5 text-[#827668] shrink-0" />
                   <div>
                     <p className="text-[10px] uppercase tracking-widest font-bold text-[#1A1C19] mb-1">Care Instructions</p>
                     <p className="text-sm font-light text-stone-500">{product.careInstructions || "Standard wash."}</p>
                   </div>
                 </div>
                 
                 <div className="flex gap-4 items-start">
                   <RefreshCcw className="w-5 h-5 text-[#827668] shrink-0" />
                   <div>
                     <p className="text-[10px] uppercase tracking-widest font-bold text-[#1A1C19] mb-1">Return Policy</p>
                     <p className="text-sm font-light text-stone-500">{product.returnPolicy || "Standard returns apply."}</p>
                   </div>
                 </div>

                 <div className="flex gap-4 items-start sm:col-span-2">
                   <Truck className="w-5 h-5 text-[#827668] shrink-0" />
                   <div>
                     <p className="text-[10px] uppercase tracking-widest font-bold text-[#1A1C19] mb-1">Delivery Information</p>
                     <p className="text-sm font-light text-stone-500">{product.deliveryInfo || "Ships worldwide in 3-5 business days."}</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </motion.div>

      </main>
    </div>
  );
}
