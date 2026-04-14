import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const Hero = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
            <Link
              to="/login"
              className="hover:text-[#1A1C19] transition-transform hover:scale-110 duration-300 cursor-pointer"
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center pt-16">
        {/* Large Typography Background */}
        <div
          className={`absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0 transition-all duration-1000 ease-out transform ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-85"}`}
        >
          <h1 className="text-[18vw] leading-none font-serif tracking-tighter text-[#EAE8E3] drop-shadow-sm whitespace-nowrap -mt-12 md:mt-0">
            FASHION
          </h1>
        </div>

        {/* Hero Image */}
        <div
          className={`relative z-10 w-[85%] md:w-[35%] h-[65%] md:h-[80%] rounded-t-full md:rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-1000 ease-out transform ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} hover:scale-[1.02] cursor-pointer group mt-8 md:mt-0`}
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
    </main>
  );
};

export default Hero;
