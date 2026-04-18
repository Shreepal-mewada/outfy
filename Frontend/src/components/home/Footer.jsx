import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#4A3C31] text-[#FAF8F5] pt-16 pb-8 px-6 md:px-22">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        
        {/* Left Side: Brand & Newsletter */}
        <div className="md:col-span-4">
          <Link to="/" className="text-2xl font-BlinkMacSystemFont tracking-tighter text-white mb-6 inline-block">
            OUTFY<span className="text-red-500">.</span>
          </Link>
          <p className="text-[11px] text-stone-300 leading-relaxed mb-8 max-w-xs">
            Exclusively styled online fashion store website design with all tools you might need.
          </p>
          
          <form className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="bg-transparent border border-stone-500 rounded-full px-5 py-3 text-xs placeholder:text-stone-400 focus:outline-none focus:border-white transition-colors"
            />
            <button 
              type="submit"
              className="bg-white text-[#4A3C31] font-bold text-[10px] uppercase tracking-[0.2em] py-3.5 rounded-full hover:bg-stone-200 transition-colors w-full sm:w-max px-8"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[9px] text-stone-400 mt-3">
            By subscribing you agree to with our Privacy Policy and provide consent to receive updates from our company.
          </p>
        </div>

        <div className="md:col-span-2 hidden md:block"></div>

        {/* Right Side: Links */}
        <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Main Pages</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-stone-300 hover:text-white text-[11px] transition-colors">Home</Link></li>
              <li><Link to="/" className="text-stone-300 hover:text-white text-[11px] transition-colors">About</Link></li>
              <li><Link to="/" className="text-stone-300 hover:text-white text-[11px] transition-colors">Category</Link></li>
              <li><Link to="/" className="text-stone-300 hover:text-white text-[11px] transition-colors">Shop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Utility Pages</h4>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-stone-300 hover:text-white text-[11px] transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-stone-300 hover:text-white text-[11px] transition-colors">Sign Up</Link></li>
              <li><Link to="/seller" className="text-stone-300 hover:text-white text-[11px] transition-colors">Seller Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="text-stone-300 text-[11px]">+1 234 567 890</li>
              <li className="text-stone-300 text-[11px]">outfy.shop@email.com</li>
              <li className="text-stone-300 text-[11px]">Manchester, 134/IV</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-600/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <ul className="flex gap-4">
          <li><Link to="/" className="text-stone-400 hover:text-white transition-colors">In</Link></li>
          <li><Link to="/" className="text-stone-400 hover:text-white transition-colors">Ig</Link></li>
          <li><Link to="/" className="text-stone-400 hover:text-white transition-colors">Fb</Link></li>
          <li><Link to="/" className="text-stone-400 hover:text-white transition-colors">Tw</Link></li>
        </ul>
        <div className="text-[10px] text-stone-400 font-medium">
          Outfy Store - Responsive Ecommerce UI
        </div>
      </div>
    </footer>
  );
};

export default Footer;
