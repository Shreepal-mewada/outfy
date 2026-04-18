import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../feature/auth/hooks/useAuth";
import { CloudCog } from "lucide-react";

import LatestProducts from "./home/LatestProducts";
import FeaturesRow from "./home/FeaturesRow";
import CategoriesGrid from "./home/CategoriesGrid";
import ExclusiveOffers from "./home/ExclusiveOffers";
import FeaturedProducts from "./home/FeaturedProducts";
import SeasonalCollection from "./home/SeasonalCollection";
import Testimonials from "./home/Testimonials";
import Footer from "./home/Footer";
const Hero = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user);

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
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
            ? "bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6 md:px-22 flex justify-between items-center">
          <div className="hidden md:flex space-x-8 text-[11px] uppercase tracking-widest font-semibold text-stone-600">
            <Link
              to="#"
              className="hover:text-[#1A1C19] transition-colors relative group"
            >
              Shop
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="#"
              className="hover:text-[#1A1C19] transition-colors relative group"
            >
              Men
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="#"
              className="hover:text-[#1A1C19] transition-colors relative group"
            >
              Women
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#1A1C19] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="#"
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
            <button className="hover:text-[#1A1C19] transition-transform hover:scale-110 duration-300 cursor-pointer">
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
            <button className="hover:text-[#1A1C19] transition-transform hover:scale-110 duration-300 cursor-pointer">
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
            </button>

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
      <div className="relative w-full h-screen flex flex-col items-center justify-center pt-16">
        {/* Large Typography Background */}
        <div
          className={`absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0 transition-all duration-700 ease-out transform ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-35"}`}
        >
          <h1 className="text-[18vw] leading-none font-serif tracking-tighter text-[#EAE8E3] drop-shadow-sm whitespace-nowrap -mt-12 md:mt-0">
            FASHION
          </h1>
        </div>

        {/* Hero Image */}
        <div
          className={`relative z-10 w-[85%] md:w-[35%] h-[65%] md:h-[80%] rounded-t-full md:rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-1000 ease-out transform ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-52"} hover:scale-[1.02] cursor-pointer group mt-8 md:mt-0`}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
          <img
            src="/outfy-fashion-model.png"
            alt="Fashion Model"
            className="w-full h-full object-cover object-center grayscale-[10%] brightness-[0.95]"
          />
        </div>

        {/* Text Block - Match Image Location (Bottom Left) */}
        <div
          className={`absolute bottom-6 md:bottom-20 left-4 md:left-20 z-20 max-w-sm transition-all duration-1000 delay-300 ease-out transform ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="p-4 md:p-6 bg-[#FAF8F5]/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-2xl md:rounded-none">
            <p className="text-sm md:text-base text-[#1A1C19] leading-relaxed mb-6 font-medium">
              Explore our website for the best deals and a seamless online
              shopping experience! Don't miss out on our exclusive offers and
              amazing savings!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-[#827668] text-[#FFFFFF] text-[11px] uppercase tracking-[0.2em] py-3.5 px-7 rounded-full hover:bg-[#6c6155] transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                Shop Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center bg-transparent border border-[#1A1C19] text-[#1A1C19] text-[11px] uppercase tracking-[0.2em] py-3.5 px-7 rounded-full hover:bg-[#1A1C19] hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
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
