import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, Loader2 } from 'lucide-react';
import { useProduct } from '../../feature/products/hooks/useProduct';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleSearchProducts } = useProduct();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await handleSearchProducts(query);
        setSuggestions(res.products || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleProductClick = (id) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${id}`);
  };

  return (
    <div ref={searchRef} className="relative flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-[#1A1C19] transition-transform hover:scale-110 duration-300 cursor-pointer text-stone-700"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: window.innerWidth < 640 ? 200 : 250 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white rounded-full border border-stone-200 shadow-sm overflow-hidden z-50"
            style={{ originX: 1 }}
          >
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-1.5 text-[11px] uppercase tracking-wider outline-none text-[#1A1C19] placeholder:text-stone-300 bg-transparent"
            />
            <button 
              onClick={() => { setIsOpen(false); setQuery(''); }}
              className="absolute right-3 text-stone-400 hover:text-[#1A1C19] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Suggestions */}
      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-[calc(100%+16px)] w-64 sm:w-72 md:w-96 bg-white border border-stone-200 shadow-xl rounded-2xl overflow-hidden z-50"
          >
            <div className="p-3 text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-100 flex justify-between items-center">
              <span>Suggestions</span>
              {loading && <Loader2 className="w-3 h-3 animate-spin text-stone-400" />}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {!loading && suggestions.length === 0 && query.trim() ? (
                <div className="p-6 text-center text-[11px] uppercase tracking-widest text-stone-400">
                  No products found for "{query}"
                </div>
              ) : (
                suggestions.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="flex items-center gap-4 p-3 hover:bg-stone-50 cursor-pointer transition-colors border-b border-stone-50 last:border-0"
                  >
                    <div className="w-12 h-16 flex-shrink-0 bg-stone-100 rounded-md overflow-hidden">
                      <img 
                        src={product.images?.[0]?.url || product.image || "/outfy-fashion-model.png"} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[9px] uppercase tracking-[0.3em] text-[#827668] mb-0.5">
                        {product.category || product.gender || "General"}
                      </p>
                      <h4 className="text-sm font-medium text-[#1A1C19] truncate">
                        {product.title}
                      </h4>
                      <p className="text-xs font-semibold text-[#1A1C19] mt-0.5">
                        {product.currency || "INR"} {product.finalPrice || product.priceAmount || product.originalPrice}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
