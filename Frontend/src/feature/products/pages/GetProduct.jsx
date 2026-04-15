import React from "react";
import { Link } from "react-router";
import { useEffect, useState } from "react";

function GetProduct() {
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
    <div>
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
    </div>
  );
}

export default GetProduct;
