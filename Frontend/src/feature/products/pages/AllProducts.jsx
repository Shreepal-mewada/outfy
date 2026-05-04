import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import { ShoppingBag, Search, ShoppingCart } from "lucide-react";
import GlobalSearch from "../../../components/common/GlobalSearch";

const CATEGORIES = ["All", "Men", "Women", "Kids", "Unisex"];
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Discount", value: "discount" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Inline Nav (matches Hero.jsx) ──────────────────────────
function InlineNav({
  scrolled,
  user,
  isProfileOpen,
  setIsProfileOpen,
  handleLogout,
  setActiveCategory,
  navCartTotal = 0,
}) {
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF9F7]/90 backdrop-blur-md shadow-sm py-4"
          : "bg-[#FAF9F7] py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-22 flex justify-between items-center">
        {/* Logo - shifted to left */}
        <Link
          to="/"
          className="text-2xl md:text-3xl tracking-tighter text-[#1A1C19]"
        >
          OUTFY<span className="text-red-500">.</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center space-x-3 text-stone-700">
          <GlobalSearch />
          {/* Cart icon with badge */}
          <Link
            to="/cart"
            className="relative hover:text-[#1A1C19] transition-transform hover:scale-110 duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {navCartTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1A1C19] text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 leading-none">
                {navCartTotal > 99 ? "99+" : navCartTotal}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-[12px] font-semibold text-[#1A1C19] uppercase tracking-wider hover:text-[#827668] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="md:hidden">
                  {(user.fullname || "User").charAt(0).toUpperCase()}
                </span>
                <span className="hidden md:inline">
                  {user.fullname || "User"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isProfileOpen && (
                <div className="absolute top-[120%] right-0 mt-3 w-56 bg-white border border-stone-200 shadow-xl rounded-2xl p-5 flex flex-col z-50">
                  <div className="flex flex-col mb-4 border-b border-stone-100 pb-4">
                    <span className="text-xs font-semibold text-[#1A1C19] truncate">
                      {user.fullname}
                    </span>
                    <span className="text-[10px] text-stone-500 truncate mt-1">
                      {user.email}
                    </span>
                    {(user.isSeller || user.role === "seller") && (
                      <span className="mt-2 inline-flex self-start text-[8px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">
                        Seller
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="text-[11px] uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-[11px] font-semibold uppercase tracking-widest text-[#1A1C19] hover:text-[#827668] transition-colors duration-300 ml-1 py-1.5 px-6 border border-[#1A1C19] rounded-full hover:border-[#827668]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Main Page ──────────────────────────────────────────────
function AllProducts() {
  const { handleGetAllProducts } = useProduct();
  const user = useSelector((state) => state.auth?.user);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const navCartTotal = cartItems.length;
  const { handleLogout } = useAuth();
  const { handleAddToCart } = useCart();
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);

  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Pre-select category from URL query param e.g. /products?category=Women
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : "All",
  );
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await handleGetAllProducts();
        if (res?.products) {
          setProducts(res.products);
          setFiltered(res.products);
        }
      } catch {
        setError("Could not load products. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Filter + Sort ────────────────────────────────────────
  useEffect(() => {
    let result = [...products];

    if (activeCategory !== "All") {
      result = result.filter(
        (p) =>
          p.gender?.toLowerCase() === activeCategory.toLowerCase() ||
          p.category?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    }

    if (sort === "price_asc")
      result.sort(
        (a, b) =>
          (a.finalPrice || a.originalPrice) - (b.finalPrice || b.originalPrice),
      );
    if (sort === "price_desc")
      result.sort(
        (a, b) =>
          (b.finalPrice || b.originalPrice) - (a.finalPrice || a.originalPrice),
      );
    if (sort === "discount")
      result.sort(
        (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
      );

    setFiltered(result);
  }, [products, activeCategory, search, sort]);

  const getTotalStock = (sizes) =>
    Array.isArray(sizes) ? sizes.reduce((s, sz) => s + (sz.stock || 0), 0) : 0;

  const handleAddToCartClick = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    setAddingId(productId);
    try {
      await handleAddToCart(productId, 1);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAddingId(null);
    }
  };

  const navProps = {
    scrolled,
    user,
    isProfileOpen,
    setIsProfileOpen,
    handleLogout,
    setActiveCategory,
    navCartTotal,
  };

  // ── Loading ──────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-[#FAF9F7] font-sans">
        <InlineNav {...navProps} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#1A1C19] border-t-transparent animate-spin" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-stone-400">
              Loading
            </p>
          </div>
        </div>
      </div>
    );

  // ── Error ────────────────────────────────────────────────
  if (error)
    return (
      <div className="min-h-screen bg-[#FAF9F7] font-sans">
        <InlineNav {...navProps} />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-[11px] uppercase tracking-widest text-red-500">
            {error}
          </p>
        </div>
      </div>
    );

  // ── Main ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1A1C19] font-sans">
      <InlineNav {...navProps} />

      <div className="pt-24">
        {/* ── Page Header ── */}

        {/* ── Toolbar ── */}
        <div className="sticky top-16 z-30 bg-[#FAF9F7]/90 backdrop-blur-md border-b border-stone-200/70">
          <div className="px-6 md:px-16 py-3 flex items-center gap-3 overflow-x-auto">
            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-[11px] uppercase tracking-wider bg-white border border-stone-200
                  rounded-full outline-none focus:border-[#1A1C19] transition-colors w-40 placeholder:text-stone-300"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-[#1A1C19] text-white"
                      : "bg-white text-stone-500 border border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex-shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-[10px] uppercase tracking-widest bg-white border border-stone-200
                  rounded-full px-4 py-1.5 outline-none cursor-pointer text-stone-600 focus:border-[#1A1C19] transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="px-6 md:px-16 py-12">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center gap-4 text-center"
            >
              <ShoppingBag size={32} className="text-stone-300" />
              <p className="text-[11px] uppercase tracking-[0.5em] text-stone-400">
                No products found
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-2 text-[10px] uppercase tracking-widest text-[#827668] underline underline-offset-4"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeCategory}-${sort}-${search}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-12"
            >
              {filtered.map((product) => {
                const id = product._id || product.id;
                const totalStock = getTotalStock(product.sizes);
                const hasDiscount = product.discountPercentage > 0;

                return (
                  <motion.div key={id} variants={cardVariants}>
                    <Link to={`/product/${id}`} className="group flex flex-col">
                      <div className="relative w-full aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden mb-3">
                        <img
                          src={
                            product.images?.[0]?.url ||
                            product.images?.[0] ||
                            product.image ||
                            "/outfy-fashion-model.png"
                          }
                          alt={product.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-[#1A1C19] text-white text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm">
                            -{product.discountPercentage}%
                          </span>
                        )}
                        {totalStock === 0 && (
                          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-[9px] uppercase tracking-widest text-stone-500">
                              Sold out
                            </span>
                          </div>
                        )}
                        {/* Hover Add to Cart overlay */}
                        {totalStock > 0 && (
                          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                            <button
                              onClick={(e) => handleAddToCartClick(e, id)}
                              disabled={addingId === id}
                              className="w-full py-2.5 bg-[#1A1C19] text-white text-[9px] uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 hover:bg-[#2d3028] transition-colors disabled:opacity-60 cursor-pointer"
                            >
                              {addingId === id ? (
                                <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <ShoppingCart size={12} />
                              )}
                              {addingId === id ? "Adding…" : "Add to Cart"}
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.5em] text-[#827668] mb-1">
                        {product.category || product.gender || "General"}
                      </p>
                      <h3 className="text-sm text-[#1A1C19] font-medium truncate mb-1.5 group-hover:underline underline-offset-2 transition-all">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1A1C19]">
                          {product.currency || "INR"}{" "}
                          {product.finalPrice ||
                            product.priceAmount ||
                            Math.round(product.originalPrice || 0)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-stone-400 line-through">
                            {product.currency || "INR"} {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllProducts;
