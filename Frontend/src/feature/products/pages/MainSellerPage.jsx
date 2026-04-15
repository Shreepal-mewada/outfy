import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import GetProduct from "./GetProduct";
import {
  LogOut,
  Plus,
  ChevronRight,
  Play,
  CheckCircle2,
  TrendingUp,
  Users,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hooks/useAuth";

function MainSellerPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const { handleLogout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1C19] font-sans antialiased overflow-x-hidden">
      {/* Seller Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-16 lg:px-24 flex justify-between items-center">
          {/* Brand */}
          <Link
            to="/seller"
            className="flex items-center gap-2 text-2xl md:text-3xl font-serif tracking-tighter text-[#1A1C19]"
          >
            OUTFY
            <span className="text-stone-400 font-sans tracking-widest text-[10px] uppercase ml-1 mt-2">
              Seller
            </span>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center space-x-6">
            <Link
              to="/seller/create"
              className="flex items-center gap-2 bg-[#827668] text-white text-[10px] uppercase tracking-[0.15em] py-2.5 px-5 rounded-full hover:bg-[#6c6155] transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow"
            >
              <Plus className="w-4 h-4" />
              Sell Product
            </Link>

            {/* <Link
              to="/"
              className="group flex items-center gap-2 text-stone-500 hover:text-[#1A1C19] transition-colors duration-300"
              title="Logout / Exit Default"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </Link> */}

            {user ? (
              <div className="relative">
                {/* Only Name shown, clickable */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-[12px] font-semibold text-[#1A1C19] uppercase tracking-wider hover:text-[#827668] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {user.fullname || "User"}
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

                {/* Profile Card Dropdown */}
                {isProfileOpen && (
                  <div className="absolute top-[120%] right-0 mt-3 w-56 bg-white border border-stone-200 shadow-xl rounded-2xl p-5 flex flex-col z-50">
                    <div className="flex flex-col mb-4 border-b border-stone-100 pb-4">
                      <span className="text-xs font-semibold text-[#1A1C19] truncate">
                        {user.fullname}
                      </span>
                      <span className="text-[10px] text-stone-500 truncate mt-1">
                        {user.email}
                      </span>
                      {user.isSeller && (
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
                      className="w-full text-center text-[10px] font-bold uppercase tracking-[0.15em] bg-red-50 text-red-600 py-2.5 rounded-xl hover:bg-red-100 transition-colors duration-300 cursor-pointer"
                    >
                      Log out
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

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          className="w-full md:w-1/2 space-y-6"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <h1 className="font-serif text-5xl md:text-7xl leading-none tracking-tighter text-[#1A1C19]">
            ZERO setup fee on over{" "}
            <span className="italic text-[#827668]">10 Million</span> products
          </h1>
          <p className="text-sm md:text-base text-stone-600 max-w-md font-medium leading-relaxed">
            Register as an Outfy seller securely. No credit card required to
            start establishing your fashion empire.
          </p>
          <Link
            to="/seller/create"
            className="inline-flex items-center gap-2 bg-[#1A1C19] text-white text-[11px] uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:bg-[#333] transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Start Selling Now <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/outfy-fashion-model.png"
            alt="Seller Workspace"
            className="w-full h-full object-cover object-top grayscale-[10%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </motion.div>
      </section>

      {/* Decorative Conveyor/Line */}
      <div className="w-full h-px bg-stone-300 relative overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute top-0 left-0 w-32 h-full bg-[#1A1C19]"
        ></motion.div>
      </div>

      {/* Outfy Seller Perks grids */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center font-serif text-4xl tracking-tighter mb-16 text-[#1A1C19]"
          >
            Platform Reach Across Categories
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Luxury Wear", stats: "High Demand", icon: "💎" },
              { label: "Sneakers", stats: "Trending", icon: "👟" },
              { label: "Accessories", stats: "Top Rated", icon: "🕶️" },
              { label: "Outerwear", stats: "Seasonal", icon: "🧥" },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="group relative bg-[#FAF8F5] rounded-2xl p-6 overflow-hidden border border-stone-100 hover:border-stone-300 transition-colors cursor-pointer"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-sm font-semibold text-[#1A1C19] mb-1">
                  {cat.label}
                </h3>
                <div className="inline-flex items-center gap-1 bg-[#dff0e6] text-green-800 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                  <CheckCircle2 className="w-3 h-3" /> {cat.stats}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dark Metrics Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full bg-[#1A1C19] text-[#FAF8F5] py-12 px-6"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-6">
          <TrendingUp className="w-10 h-10 text-[#827668]" />
          <h3 className="font-serif text-2xl tracking-tight">
            On average, 71% of new sellers get their first sale within 4 weeks
            of starting their brand on Outfy.
          </h3>
        </div>
      </motion.section>

      {/* Build your brand stats row */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:w-1/4 text-center lg:text-left"
          >
            <h2 className="font-serif text-4xl tracking-tighter text-[#1A1C19] leading-tight">
              Build your
              <br /> Brand with Us
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:w-3/4 grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                title: "300M+",
                desc: "Unique visitors over last holiday season",
                icon: <Users />,
              },
              {
                title: "99.3%",
                desc: "Orders arrived on time for delivery",
                icon: <Truck />,
              },
              {
                title: "38K+",
                desc: "Registered active lifestyle sellers",
                icon: <CheckCircle2 />,
              },
              {
                title: "14M+",
                desc: "Diverse products across India",
                icon: <TrendingUp />,
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <div className="text-[#827668] mb-3">{stat.icon}</div>
                <h4 className="font-serif text-3xl font-bold text-[#1A1C19] mb-2">
                  {stat.title}
                </h4>
                <p className="text-[11px] uppercase tracking-widest text-stone-500 leading-relaxed">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials / Video placeholders like see what our sellers say */}
      <section className="py-24 bg-white px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center font-serif text-4xl tracking-tighter mb-16 text-[#1A1C19]"
          >
            See what our sellers have to say
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Suresh Gupta",
                brand: "Luxe Wear",
                title: "Scale with Outfy",
              },
              {
                name: "Anita Rao",
                brand: "Minimalist",
                title: "Reach Millions",
              },
              {
                name: "Rahul Singh",
                brand: "Urban Edge",
                title: "Premium Tools",
              },
            ].map((testi, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src="/outfy-fashion-model.png"
                  alt="Seller"
                  className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <p className="text-[10px] uppercase tracking-widest text-[#827668] mb-1 border-l-2 border-[#827668] pl-2">
                    {testi.brand}
                  </p>
                  <h3 className="font-serif text-2xl font-medium mb-4">
                    {testi.name}
                  </h3>

                  <button className="flex items-center gap-2 text-xs font-semibold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                    <Play className="w-3 h-3 fill-current" /> Watch
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Your Active Catalog / GetProduct Injection */}
      <section className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-stone-200 pb-6">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="font-serif text-4xl tracking-tighter text-[#1A1C19] mb-2">
                Your Catalog
              </h2>
              <p className="text-[11px] uppercase tracking-widest text-stone-500">
                Manage your active inventory directly from your dashboard.
              </p>
            </motion.div>
          </div>

          <GetProduct />
        </div>
      </section>

      {/* Newsletter & Start Selling CTA Banner */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#EAE8E3]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Newsletter Box */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-[#FAF8F5] rounded-[2rem] p-10 flex flex-col justify-center"
          >
            <h3 className="font-serif text-4xl tracking-tight text-[#1A1C19] mb-4">
              Outfy.in
              <br />
              Newsletter!
            </h3>
            <p className="text-sm text-stone-500 mb-8 font-medium">
              Read success stories of sellers, hear from our leaders and know
              more about building a brand on Outfy.
            </p>

            <div className="flex bg-white rounded-full p-2 border border-stone-200 focus-within:border-[#827668] transition-colors">
              <input
                type="email"
                placeholder="Email address..."
                className="bg-transparent border-none outline-none px-4 text-sm w-full"
              />
              <button className="bg-[#1A1C19] text-white text-[10px] uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#333] transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>

          {/* Start Selling Box */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative rounded-[2rem] overflow-hidden p-10 flex flex-col justify-end bg-stone-900 aspect-[4/3] md:aspect-auto"
          >
            <img
              src="/outfy-fashion-model.png"
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
              alt="CTA"
            />
            <div className="relative z-10">
              <h3 className="font-serif text-4xl tracking-tight text-white mb-3">
                Start selling
                <br />
                today!
              </h3>
              <p className="text-[11px] uppercase tracking-widest text-stone-300 mb-6">
                Build your legacy on Outfy marketplace
              </p>
              <Link
                to="/seller/create"
                className="inline-flex bg-[#827668] text-white text-[11px] uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:bg-[#6c6155] transition-all"
              >
                Start Selling
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Line */}
      <footer className="w-full bg-[#1A1C19] text-white py-8 text-center text-[10px] uppercase tracking-widest opacity-90">
        <p>© 2026 Outfy. Build your legacy.</p>
      </footer>
    </div>
  );
}

export default MainSellerPage;
