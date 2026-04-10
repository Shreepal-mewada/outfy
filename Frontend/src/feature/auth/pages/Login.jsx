import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
  const { handleLogin } = useLogin();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const response = await handleLogin({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (response && response.success) {
      navigate("/");
    } else {
      const msg = response?.error || "Login failed. Please try again.";
      const lowerMsg = msg.toLowerCase();
      // Heuristic to map error to specific field
      if (lowerMsg.includes("password")) {
        setErrors({ password: msg });
      } else {
        setErrors({ email: msg });
      }
    }
  };

  return (
    <main className="min-h-screen md:h-screen flex flex-col md:flex-row bg-[#FAF8F5] text-[#1A1C19] font-sans antialiased overflow-y-auto md:overflow-hidden">
      {/* Visual / Fashion Presentation Column */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-[#EAE8E3]">
        <img
          className="absolute inset-0 w-full h-full object-cover object-center grayscale-[10%] brightness-[0.95]"
          alt="Minimalist editorial fashion shot"
          src="/outfy-fashion-model.png"
        />

        {/* Brand Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-12">
          <div className="text-[#FAF8F5]">
            <h2 className="font-serif text-4xl italic tracking-tight mb-2 text-white">
              Outfy
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-200">
              Style that speaks for you.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-6 md:px-16 lg:px-24 bg-[#FAF8F5] overflow-y-auto hide-scrollbar">
        <div className="max-w-md w-full mx-auto">
          <header className="mb-6">
            <h1 className="font-serif text-3xl mb-1 tracking-tighter text-[#1A1C19]">
              Welcome Back
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-stone-500">
              Log in to your account.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Address */}
            <div className="group">
              <label
                className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-400 focus:outline-none focus:ring-0 transition-colors duration-300 ${
                  errors.email ? "border-red-500 focus:border-red-500" : "border-stone-300 focus:border-[#7d7164]"
                }`}
                id="email"
                name="email"
                placeholder="hello@outfy.com"
                type="email"
                required
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="group">
              <label
                className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-400 focus:outline-none focus:ring-0 transition-colors duration-300 ${
                  errors.password ? "border-red-500 focus:border-red-500" : "border-stone-300 focus:border-[#7d7164]"
                }`}
                id="password"
                name="password"
                placeholder="••••••••••••"
                type="password"
                required
              />
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">{errors.password}</p>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                disabled={isLoading}
                className="w-full bg-[#827668] text-[#FFFFFF] text-[11px] uppercase tracking-[0.2em] py-3 rounded-full hover:bg-[#6c6155] disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98]"
                type="submit"
              >
                {isLoading ? "Signing in..." : "Log In"}
              </button>
            </div>

            {/* Redirect */}
            <div className="text-center mt-4">
              <p className="text-[11px] text-stone-500">
                Don't have an account?{" "}
                <Link
                  className="text-[#1A1C19] font-medium underline underline-offset-4 hover:text-[#827668] transition-colors duration-300 ml-1"
                  to="/register"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-8 flex justify-between items-center opacity-40">
          <span className="text-[9px] uppercase tracking-widest">
            © 2026 OUTFY.
          </span>
          <div className="flex space-x-6">
            <a
              className="text-[9px] uppercase tracking-widest hover:text-[#827668]"
              href="#"
            >
              Legal
            </a>
            <a
              className="text-[9px] uppercase tracking-widest hover:text-[#827668]"
              href="#"
            >
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Login;
