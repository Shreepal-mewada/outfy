import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../../cart/hooks/useCart";
import { ArrowLeft, Edit2, ShieldCheck, Truck, RefreshCcw, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

// ── tiny helper ──────────────────────────────────────────────────
function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-[#EAE8E3] last:border-0">
      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">{label}</span>
      <span className="text-xs font-medium text-[#1A1C19] text-right max-w-[55%]">{value}</span>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById, handleGetAllProducts, isLoading, error } = useProduct();
  const { handleAddToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [moreProducts, setMoreProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const isSeller = user?.isSeller || user?.role === "seller";
  const isProductOwner = isSeller && product && (product.seller === user.id || product.seller?._id === user.id);

  // fetch current product
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await handleGetProductById(id);
        if (data?.product) {
          setProduct(data.product);
          setSelectedSize(null); // reset size on product change
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
    setActiveImage(0);
  }, [id]);

  const handleAddToCartClick = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    try {
      await handleAddToCart(product._id, 1);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  // fetch all products for "More" strip
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await handleGetAllProducts();
        if (res?.products) {
          setMoreProducts(res.products.filter((p) => (p._id || p.id) !== id));
        }
      } catch (_) {}
    };
    fetchAll();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#1A1C19] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">{error || "Product not found."}</p>
        <Link to={isSeller ? "/seller" : "/"} className="text-[#827668] underline text-sm">
          {isSeller ? "Return to Dashboard" : "Back to Shop"}
        </Link>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images.map((i) => i.url || i)
      : ["/outfy-fashion-model.png"];

  const hasDiscount = product.discountPercentage > 0;
  const currency = product.currency || "INR";
  const totalStock = product.sizes?.reduce((s, x) => s + (x.stock || 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1C19] font-sans" style={{ zoom: 0.9 }}>

      {/* ── Navbar ────────────────────────────────────── */}
      <nav className="border-b border-[#EAE8E3] bg-white sticky top-0 z-10 px-5 py-3 flex items-center justify-between">
        <Link
          to={isSeller ? "/seller" : "/"}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#827668] hover:text-[#1A1C19] transition-colors font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {isSeller ? "Back to Dashboard" : "Back to Shop"}
        </Link>
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
          {isSeller ? "Seller Preview Mode" : "Product Details"}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 py-8 lg:py-12">

        {/* ── Hero Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-[4/5] bg-[#EAE8E3] rounded-2xl overflow-hidden relative shadow-sm"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  alt={product.title}
                />
              </AnimatePresence>
            </motion.div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2.5">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === idx
                        ? "border-[#1A1C19] opacity-100"
                        : "border-transparent opacity-50 hover:opacity-90"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: All Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-0"
          >
            {/* Brand / Category breadcrumb */}
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#827668] mb-3 flex items-center gap-2">
              <span>{product.brandName || "Outfy Originals"}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span>{product.category || "General"}</span>
              {product.gender && (
                <>
                  <span className="w-1 h-1 rounded-full bg-stone-300" />
                  <span>{product.gender}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl lg:text-[2.2rem] tracking-tighter leading-tight mb-3 text-[#1A1C19]">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-stone-500 mb-5 leading-relaxed font-light text-[13px]">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-5 space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold tracking-tight">
                  {currency}{" "}
                  {product.finalPrice ||
                    Math.round(
                      product.originalPrice -
                        product.originalPrice * (product.discountPercentage / 100)
                    )}
                </span>
                {hasDiscount && (
                  <span className="bg-[#1A1C19] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-stone-400 font-medium line-through text-sm">
                  {currency} {product.originalPrice}
                </span>
              )}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-widest text-[#827668] font-bold mb-2">
                  Available Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, idx) => (
                    <div
                      key={idx}
                      className={`border px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                        s.stock > 0
                          ? "border-[#1A1C19] text-[#1A1C19] bg-white"
                          : "border-stone-200 text-stone-300 bg-stone-50"
                      }`}
                    >
                      {s.size}
                      <span className="text-[10px] opacity-50">({s.stock})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Inline Specs ───────────────────────────── */}
            <div className="mb-5 bg-white rounded-2xl border border-stone-100 px-4 py-1 shadow-sm">
              <SpecRow label="Total Stock" value={`${totalStock} units`} />
              <SpecRow label="Fabric" value={product.fabric} />
              <SpecRow label="Fit" value={product.fit} />
              <SpecRow label="Pattern" value={product.pattern} />
              <SpecRow label="Sleeve" value={product.sleeveType} />
              <SpecRow label="Occasion" value={product.occasion?.length ? product.occasion.join(", ") : null} />
              <SpecRow label="Tags" value={product.tags?.length ? product.tags.join(", ") : null} />
            </div>

            {/* ── Policies strip ─────────────────────────── */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              {[
                { Icon: ShieldCheck, label: "Care", value: product.careInstructions || "Standard wash" },
                { Icon: RefreshCcw, label: "Returns", value: product.returnPolicy || "Standard policy" },
                { Icon: Truck,       label: "Delivery", value: product.deliveryInfo || "3–5 business days" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="bg-white border border-stone-100 rounded-xl p-3 flex flex-col gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-[#827668]" />
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1A1C19]">{label}</p>
                  <p className="text-[10px] text-stone-400 font-light leading-snug">{value}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="border-t border-[#EAE8E3] pt-5 flex flex-col gap-3">
              {isProductOwner ? (
                <Link
                  to={`/seller/edit/${product._id}`}
                  className="w-full bg-[#1A1C19] text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#827668] transition-colors shadow-lg shadow-stone-200"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Listing
                </Link>
              ) : totalStock === 0 ? (
                <button
                  disabled
                  className="w-full bg-stone-100 text-stone-400 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={handleAddToCartClick}
                  disabled={addingToCart}
                  className="w-full bg-[#1A1C19] text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2d3028] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-stone-200 disabled:opacity-60 cursor-pointer"
                >
                  {addingToCart ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : addedFeedback ? (
                    <>
                      <span>✓</span> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </>
                  )}
                </button>
              )}
              {!user && (
                <p className="text-center text-[9px] uppercase tracking-wider text-stone-400">
                  <Link to="/login" className="underline hover:text-[#1A1C19] transition-colors">Sign in</Link> to add items to your cart
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── More Products ──────────────────────────────── */}
        {moreProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 border-t border-[#EAE8E3] pt-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl tracking-tighter text-[#1A1C19]">More Products</h2>
                <p className="text-[10px] uppercase tracking-widest text-[#827668] font-bold mt-0.5">
                  Explore the full collection
                </p>
              </div>
            </div>

            {/* Horizontal scroll strip */}
            <div
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {moreProducts.map((p) => {
                const pid = p._id || p.id;
                const thumb = p.images?.[0]?.url || p.images?.[0] || "/outfy-fashion-model.png";
                const pDiscount = p.discountPercentage > 0;
                const pCurrency = p.currency || "INR";
                const pPrice = p.finalPrice || Math.round(p.originalPrice - p.originalPrice * (p.discountPercentage / 100));

                return (
                  <motion.button
                    key={pid}
                    onClick={() => navigate(`/product/${pid}`)}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="flex-none w-44 snap-start group text-left"
                  >
                    {/* Image */}
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#EAE8E3] mb-3 relative">
                      <img
                        src={thumb}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {pDiscount && (
                        <span className="absolute top-2 left-2 bg-[#1A1C19] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          -{p.discountPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <p className="text-xs font-medium text-[#1A1C19] truncate leading-tight">{p.title}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest truncate mb-1">
                      {p.category || "General"}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1A1C19]">{pCurrency} {pPrice}</span>
                      {pDiscount && (
                        <span className="text-[10px] text-stone-400 line-through">{p.originalPrice}</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        )}

      </main>
    </div>
  );
}
