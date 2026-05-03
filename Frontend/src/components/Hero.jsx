import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../feature/auth/hooks/useAuth";
import { useNavigate } from "react-router";
import LatestProducts from "./home/LatestProducts";
import FeaturesRow from "./home/FeaturesRow";
import CategoriesGrid from "./home/CategoriesGrid";
import ExclusiveOffers from "./home/ExclusiveOffers";
import FeaturedProducts from "./home/FeaturedProducts";
import SeasonalCollection from "./home/SeasonalCollection";
import Testimonials from "./home/Testimonials";
import Footer from "./home/Footer";
import ImageSlider from "./CrazyComponents/jsx/ImageSlider";
import GlobalSearch from "./common/GlobalSearch";

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalCartItems = cartItems.length;
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#FAF8F5] text-[#1A1C19] font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-22 flex justify-between items-center">
          <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-widest font-semibold text-stone-600">
            <Link
              to="/products"
              className="hover:text-[#1A1C19] transition-colors relative group"
            >
              Shop
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/products?category=Men"
              className="hover:text-[#1A1C19] transition-colors relative group"
            >
              Men
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/products?category=Women"
              className="hover:text-[#1A1C19] transition-colors relative group"
            >
              Women
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/products?category=Kids"
              className="hover:text-[#1A1C19] transition-colors relative group"
            >
              Kids
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {(user?.isSeller || user?.role === "seller") && (
              <Link
                to="/seller"
                className="text-[#827668] hover:text-[#1A1C19] transition-colors relative group font-bold tracking-widest"
              >
                Dashboard
                <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#827668] transition-all duration-300 group-hover:w-full group-hover:bg-[#1A1C19]"></span>
              </Link>
            )}
          </div>

          <Link
            to="/"
            className="text-2xl md:text-3xl font-BlinkMacSystemFont tracking-tighter text-[#1A1C19] ml-0 md:-ml-20"
          >
            OUTFY<span className="text-red-500">.</span>
          </Link>

          <div className="flex space-x-5 text-stone-700">
            <GlobalSearch />
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
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1A1C19] text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 leading-none">
                  {totalCartItems > 99 ? "99+" : totalCartItems}
                </span>
              )}
            </Link>

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

      {/* Main Hero Content */}
      <div className="relative w-full h-screen">
        <ImageSlider
          autoPlay={true}
          interval={4000}
          accentColor="#ffffff" // Since it's full dark mode, white/light accent looks better, or Outfy's gold
          showPagination={true}
        />
      </div>

      <LatestProducts />
      <FeaturesRow />
      <CategoriesGrid />
      <ExclusiveOffers />
      <FeaturedProducts />
      <SeasonalCollection />
      <Testimonials />
      <Footer />
    </main>
  );
};

export default Hero;
