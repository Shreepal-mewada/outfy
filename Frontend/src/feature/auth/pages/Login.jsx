import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const { handleLogin, handleGoogleAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const googleLoginFlow = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setErrors({});
      setIsLoading(true);
      const response = await handleGoogleAuth(tokenResponse.access_token);
      setIsLoading(false);
      if (response && response.success) {
        if (response.user?.role === "seller") {
          navigate("/seller");
        } else {
          navigate("/");
        }
      } else {
        setErrors({ email: response?.error || "Google login failed." });
      }
    },
    onError: () => {
      setErrors({ email: "Google login cancelled or failed." });
    },
  });

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
      if (response.user?.isSeller) {
        navigate("/seller");
      } else {
        navigate("/");
      }
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
            {/* Google Auth Button */}
            <button
              type="button"
              onClick={() => googleLoginFlow()}
              disabled={isLoading}
              className="w-full flex cursor-pointer items-center justify-center gap-3 bg-white border border-stone-200 text-[#1A1C19] text-[11px] uppercase tracking-[0.15em] font-medium py-3 rounded-full hover:bg-stone-50 hover:border-stone-300 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98] shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-4 h-4"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-stone-200"></div>
              <span className="text-[9px] uppercase tracking-widest text-stone-400">
                or
              </span>
              <div className="flex-1 h-px bg-stone-200"></div>
            </div>

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
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-stone-300 focus:border-[#7d7164]"
                }`}
                id="email"
                name="email"
                placeholder="hello@outfy.com"
                type="email"
                required
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">
                  {errors.email}
                </p>
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
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-stone-300 focus:border-[#7d7164]"
                }`}
                id="password"
                name="password"
                placeholder="••••••••••••"
                type="password"
                required
              />
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                disabled={isLoading}
                className="w-full bg-[#827668] cursor-pointer text-[#FFFFFF] text-[11px] uppercase tracking-[0.2em] py-3 rounded-full hover:bg-[#6c6155] disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98]"
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
                  className="text-[#1A1C19] font-medium  hover:text-[#827668] transition-colors duration-300 ml-1"
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
