import React, { useState } from "react";
import { Link } from "react-router";
import { Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setSubscribed(true);
  };
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

          <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
            {!subscribed && (
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="bg-transparent border border-stone-500 rounded-full px-5 py-3 text-xs placeholder:text-stone-400 focus:outline-none focus:border-white transition-colors"
              />
            )}
            {error && (
              <p className="text-red-400 text-[10px] pl-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={subscribed}
              className={`font-bold text-[10px] uppercase tracking-[0.2em] py-3.5 cursor-pointer rounded-full transition-colors w-full sm:w-max px-8 ${subscribed
                ? "bg-green-500 text-white cursor-default"
                : "bg-white text-[#4A3C31] hover:bg-stone-200"
                }`}
            >
              {subscribed ? "Subscribed ✓" : "Subscribe"}
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
              <li><Link to="/products" className="text-stone-300 hover:text-white text-[11px] transition-colors">Shop</Link></li>
              <li><Link to="/cart" className="text-stone-300 hover:text-white text-[11px] transition-colors">Cart</Link></li>
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

          {/* Developer Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Developer</h4>
            <ul className="space-y-4">
              <li className="text-stone-200 text-[11px] font-semibold tracking-wide">Shreepal Mewada</li>
              <li>
                <a
                  href="mailto:shreepalme@gmail.com"
                  className="flex items-center gap-2 text-stone-300 hover:text-white text-[11px] transition-colors group"
                >
                  <Mail size={11} className="text-stone-400 group-hover:text-red-400 transition-colors" />
                  shreepalme@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917828045156"
                  className="flex items-center gap-2 text-stone-300 hover:text-white text-[11px] transition-colors group"
                >
                  <Phone size={11} className="text-stone-400 group-hover:text-red-400 transition-colors" />
                  +91 78280 45156
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/shreepal-mewada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-stone-300 hover:text-white text-[11px] transition-colors group"
                >
                  <ExternalLink size={11} className="text-stone-400 group-hover:text-blue-400 transition-colors" />
                  in/shreepal-mewada
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-600/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <ul className="flex gap-5">
          <li>
            <a
              href="https://linkedin.com/in/shreepal-mewada"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-blue-400 text-[10px] uppercase tracking-widest transition-colors"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="mailto:shreepalme@gmail.com"
              className="text-stone-400 hover:text-white text-[10px] uppercase tracking-widest transition-colors"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href="tel:+917828045156"
              className="text-stone-400 hover:text-white text-[10px] uppercase tracking-widest transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="text-[10px] text-stone-400 font-medium text-center">
          © {new Date().getFullYear()} OutfyStore · Designed & Developed by{" "}
          <a
            href="https://linkedin.com/in/shreepal-mewada"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-200 hover:text-white transition-colors font-semibold"
          >
            Shreepal Mewada
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
