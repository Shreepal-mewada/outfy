import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { loadRazorpay } from "../../../utils/loadRazorpay";
import { createOrder, verifyPayment } from "../../payment/services/payment.api";

const Cart = () => {
  const { items, loading, error } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth?.user);
  const { handleGetCart, handleUpdateCartItem, handleRemoveFromCart } = useCart();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    handleGetCart();
  }, []);

  const handleIncrement = async (productId, currentQty, size) => {
    await handleUpdateCartItem(productId, currentQty + 1, size);
  };

  const handleDecrement = async (productId, currentQty, size) => {
    if (currentQty <= 1) return; // Use explicit Remove button for deletion
    await handleUpdateCartItem(productId, currentQty - 1, size);
  };

  const handleRemove = async (productId, size) => {
    await handleRemoveFromCart(productId, size);
  };

  const subtotal = items.reduce((sum, item) => {
    const price =
      item.product?.finalPrice ||
      item.product?.priceAmount ||
      item.product?.originalPrice ||
      0;
    return sum + price * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePayment = async () => {
    if (!user) {
      alert("Please login to proceed with the payment.");
      navigate("/login");
      return;
    }

    setIsProcessingPayment(true);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const orderData = await createOrder();

      if (!orderData || !orderData.order) {
        alert("Server error. Please try again.");
        setIsProcessingPayment(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Outfy Store",
        description: "Test Transaction",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              alert("Payment Successful!");
              await handleGetCart(); // refresh the cart (should be empty now)
              navigate("/");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            alert("Error verifying payment.");
          }
        },
        prefill: {
          name: user.fullname || "",
          email: user.email || "",
          contact: user.phone || "9999999999",
        },
        theme: {
          color: "#1A1C19",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create order.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading && items.length === 0)
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#1A1C19] border-t-transparent animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-stone-400">
            Loading
          </p>
        </div>
      </div>
    );

  // ── Error ────────────────────────────────────────────────────────────────
  if (error)
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <p className="text-[11px] uppercase tracking-widest text-red-500">
          {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1A1C19] font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#FAF9F7]/90 backdrop-blur-md border-b border-stone-200/60 py-4">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link
            to="/products"
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#1A1C19] hover:text-[#827668] transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="text-2xl tracking-tighter text-[#1A1C19] font-semibold"
          >
            OUTFY<span className="text-red-500">.</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-28 pb-20">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <p className="text-[10px] uppercase tracking-[0.6em] text-[#827668] mb-2">
            Your Selection
          </p>
          <div className="flex items-end justify-between border-b border-stone-200 pb-6">
            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-[0.08em]">
              Shopping Cart
            </h1>
            <span className="text-[11px] uppercase tracking-[0.4em] text-stone-400">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {items.length === 0 ? (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-32 gap-6"
          >
            <ShoppingBag size={44} className="text-stone-200" strokeWidth={1} />
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.5em] text-stone-400 mb-1">
                Your cart is empty
              </p>
              <p className="text-[10px] text-stone-300 tracking-wider">
                Discover something you'll love
              </p>
            </div>
            <Link
              to="/products"
              className="mt-4 px-8 py-3 bg-[#1A1C19] text-white text-[10px] uppercase tracking-[0.3em] hover:bg-[#2d3028] transition-colors rounded-full"
            >
              Shop Now
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            {/* ── Cart Items ── */}
            <div className="space-y-0">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => {
                  const product = item.product;
                  const price =
                    product?.finalPrice ||
                    product?.priceAmount ||
                    Math.round(product?.originalPrice || 0);
                  const imageUrl =
                    product?.images?.[0]?.url ||
                    product?.images?.[0] ||
                    product?.image ||
                    null;

                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: -30,
                        transition: { duration: 0.25 },
                      }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.06,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="group flex gap-5 py-6 border-b border-stone-100"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-shrink-0 w-24 h-32 md:w-28 md:h-36 bg-stone-100 rounded-lg overflow-hidden"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag
                              size={24}
                              className="text-stone-300"
                              strokeWidth={1}
                            />
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.45em] text-[#827668] mb-1">
                            {product.category || product.gender || "General"}
                          </p>
                          <Link
                            to={`/product/${product._id}`}
                            className="text-sm font-medium text-[#1A1C19] truncate block hover:underline underline-offset-2 transition-all mb-1"
                          >
                            {product.title}
                          </Link>
                          {item.size && (
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-2">
                              Size: {item.size}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-[#1A1C19]">
                            {product.currency || "INR"} {price}
                          </p>
                        </div>

                        {/* Quantity + Remove */}
                        <div className="flex items-center justify-between mt-3">
                          {/* Qty stepper */}
                          <div className="flex items-center gap-3 border border-stone-200 rounded-full px-3 py-1.5">
                            <button
                              onClick={() =>
                                handleDecrement(product._id, item.quantity, item.size)
                              }
                              disabled={item.quantity <= 1 || loading}
                              className="text-stone-400 hover:text-[#1A1C19] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-[12px] font-semibold text-[#1A1C19] min-w-[16px] text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleIncrement(product._id, item.quantity, item.size)
                              }
                              disabled={loading}
                              className="text-stone-400 hover:text-[#1A1C19] transition-colors disabled:opacity-30 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(product._id, item.size)}
                            disabled={loading}
                            className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors disabled:opacity-30 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Line total — visible md+ */}
                      <div className="hidden md:flex flex-col items-end justify-between py-1 flex-shrink-0">
                        <span className="text-sm font-semibold text-[#1A1C19] tabular-nums">
                          {product.currency || "INR"}{" "}
                          {(price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ── Order Summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-28 self-start"
            >
              <div className="bg-white border border-stone-100 rounded-2xl p-8 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-6">
                  Order Summary
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[12px] text-stone-600">
                    <span className="tracking-wide">
                      Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                    </span>
                    <span className="font-semibold text-[#1A1C19] tabular-nums">
                      INR {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[12px] text-stone-400">
                    <span className="tracking-wide">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="pt-4 border-t border-stone-100 flex justify-between">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-[#1A1C19]">
                      Total
                    </span>
                    <span className="text-base font-bold text-[#1A1C19] tabular-nums">
                      INR {subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 bg-[#1A1C19] text-white text-[10px] uppercase tracking-[0.35em] font-semibold rounded-xl hover:bg-[#2d3028] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                <p className="mt-4 text-center text-[9px] uppercase tracking-wider text-stone-300">
                  Secure · Premium · Free Returns
                </p>
              </div>

              {/* Loading overlay on summary */}
              {loading && (
                <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#1A1C19] border-t-transparent animate-spin" />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
