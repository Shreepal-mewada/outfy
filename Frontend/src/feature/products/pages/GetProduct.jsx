import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { motion } from "framer-motion";
import { Edit2, Trash2, Power, EyeOff, Eye } from "lucide-react";

function GetProduct() {
  const { handleGetProducts, handleDeleteProduct, handleToggleProductStatus } = useProduct();
  const user = useSelector((state) => state.auth?.user);
  const isSeller = user?.isSeller || user?.role === "seller";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [localProducts, setLocalProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await handleGetProducts();
      if (res && res.products) {
        setLocalProducts(res.products);
      }
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getTotalStock = (sizes) => {
    if (!sizes || !Array.isArray(sizes)) return 0;
    return sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
  };

  const deleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await handleDeleteProduct(id);
      setLocalProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
    } catch(err) {
      alert("Failed to delete product.");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await handleToggleProductStatus(id);
      setLocalProducts(prev => prev.map(p => (p._id === id || p.id === id) ? res.product : p));
    } catch(err) {
      alert("Failed to toggle status.");
    }
  };

  // Staggered animation variants
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

  if (loading) {
    return <div className="py-20 flex justify-center"><div className="w-6 h-6 border-2 border-[#1A1C19] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (error) {
    return <div className="py-20 flex justify-center"><p className="text-[11px] uppercase tracking-widest text-red-500">{error}</p></div>;
  }

  if (localProducts.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center border border-dashed border-stone-300 rounded-3xl bg-white/50 backdrop-blur-sm">
        <h3 className="font-serif text-2xl text-[#1A1C19] mb-2">No products yet.</h3>
        <p className="text-[11px] uppercase tracking-widest text-stone-500">Your active listings will appear here.</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
      {localProducts.map((product) => {
        const id = product._id || product.id;
        const totalStock = getTotalStock(product.sizes);
        const hasDiscount = product.discountPercentage > 0;
        
        return (
        <motion.div key={id} variants={itemVariants} className={`group flex flex-col relative ${!product.isActive ? 'opacity-60 grayscale-[30%]' : ''}`}>
          
          {/* Status Overlay */}
          {!product.isActive && (
            <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1">
              <EyeOff className="w-3 h-3" /> Inactive
            </div>
          )}

          {/* Action Menu (Hover) — Preview visible to all, seller actions gated */}
          <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to={`/product/${id}`} className="bg-white/90 backdrop-blur text-[#1A1C19] p-2 rounded-full shadow hover:bg-white transition flex items-center justify-center" title="Preview">
              <Eye className="w-3 h-3" />
            </Link>
            {isSeller && (
              <>
                <button onClick={() => toggleStatus(id)} className="bg-white/90 backdrop-blur text-[#1A1C19] p-2 rounded-full shadow hover:bg-white transition" title={product.isActive ? "Deactivate" : "Activate"}>
                  <Power className="w-3 h-3" />
                </button>
                <Link to={`/seller/edit/${id}`} className="bg-white/90 backdrop-blur text-[#1A1C19] p-2 rounded-full shadow hover:bg-white transition flex items-center justify-center" title="Edit">
                  <Edit2 className="w-3 h-3" />
                </Link>
                <button onClick={() => deleteProduct(id)} className="bg-white/90 backdrop-blur text-red-600 p-2 rounded-full shadow hover:bg-white transition" title="Delete">
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          {/* Image Container */}
          <Link to={`/product/${id}`} className="block relative w-full aspect-[3/4] bg-stone-100 mb-4 overflow-hidden rounded-xl cursor-pointer">
            <img
              src={product.images?.[0]?.url || product.images?.[0] || product.image || "/outfy-fashion-model.png"}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Product Details */}
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="text-sm font-medium text-[#1A1C19] truncate">{product.title}</h3>
            <span className="text-[10px] uppercase tracking-widest text-[#827668] whitespace-nowrap bg-stone-100 px-2 py-0.5 rounded">
              {product.gender || "Unisex"}
            </span>
          </div>
          
          <p className="text-[11px] uppercase tracking-widest text-stone-500 mb-2 truncate">
            {product.category || "General"} • {totalStock} in stock
          </p>
          
          <div className="flex items-center text-sm font-semibold text-[#1A1C19] gap-2">
            <span>{product.currency || "INR"} {product.finalPrice || product.priceAmount || Math.round(product.originalPrice || 0)}</span>
            {hasDiscount && (
              <span className="text-[11px] text-stone-400 line-through font-normal">
                {product.currency || "INR"} {product.originalPrice}
              </span>
            )}
            {hasDiscount && (
              <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm font-bold ml-1">
                 -{product.discountPercentage}%
              </span>
            )}
          </div>
        </motion.div>
      )})}
    </motion.div>
  );
}

export default GetProduct;
