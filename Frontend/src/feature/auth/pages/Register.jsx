import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
// import image1 from "../../../../public/download.jpg";
import { useAuth } from "../hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const { handleRegister, handleGoogleAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",
    isSeller: false,
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
        if (response.user?.isSeller) {
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
    const { name, value, type, checked } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "contactNumber") {
      // Allow only numbers and restrict to 10 digits
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const response = await handleRegister({
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      isSeller: formData.isSeller,
      fullname: formData.fullName,
    });

    setIsLoading(false);

    if (response && response.success) {
      if (response.user?.isSeller) {
        navigate("/seller");
      } else {
        navigate("/");
      }
    } else {
      const msg = response?.error || "Registration failed. Please try again.";
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes("password")) setErrors({ password: msg });
      else if (lowerMsg.includes("contact")) setErrors({ contactNumber: msg });
      else if (lowerMsg.includes("name")) setErrors({ fullName: msg });
      else setErrors({ email: msg });
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
          // src={image1}
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

      {/* Registration Form Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-4 md:py-6 md:px-16 lg:px-24 bg-[#FAF8F5] overflow-y-auto hide-scrollbar">
        <div className="max-w-md w-full mx-auto ">
          <header className="mb-4 md:mb-6">
            <h1 className="font-serif text-2xl md:text-3xl mb-1 tracking-tighter text-[#1A1C19]">
              Welcome to Outfy
            </h1>

            <p className="text-[10px] uppercase tracking-widest text-stone-500">
              Premium looks. Everyday comfort.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-7">
            {/* Google Auth Button */}
            <button
              type="button"
              onClick={() => googleLoginFlow()}
              disabled={isLoading}
              className="w-full flex cursor-pointer items-center justify-center gap-3 bg-white border border-stone-200 text-[#1A1C19] text-[11px] uppercase tracking-[0.15em] font-medium py-2.5 md:py-3 rounded-full hover:bg-stone-50 hover:border-stone-300 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98] shadow-sm"
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

            {/* Name and Contact Row */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Full Name */}
              <div className="group flex-1">
                <label
                  className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-400 focus:outline-none focus:ring-0 transition-colors duration-300 ${
                    errors.fullName
                      ? "border-red-500 focus:border-red-500"
                      : "border-stone-300 focus:border-[#7d7164]"
                  }`}
                  id="fullName"
                  name="fullName"
                  placeholder="Ex. Alexander Vogue"
                  type="text"
                />
                {errors.fullName && (
                  <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="group flex-1">
                <label
                  className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                  htmlFor="contactNumber"
                >
                  Contact Number
                </label>
                <input
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-400 focus:outline-none focus:ring-0 transition-colors duration-300 ${
                    errors.contactNumber
                      ? "border-red-500 focus:border-red-500"
                      : "border-stone-300 focus:border-[#7d7164]"
                  }`}
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="9876543210"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  type="tel"
                  required
                />
                {errors.contactNumber && (
                  <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">
                    {errors.contactNumber}
                  </p>
                )}
              </div>
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
              />
              {errors.password && (
                <p className="text-[10px] text-red-500 mt-1 uppercase tracking-wider">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Is Seller Checkbox */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                checked={formData.isSeller}
                onChange={handleChange}
                className="w-3.5 h-3.5 rounded-none border-stone-300 text-[#7d7164] focus:ring-0 cursor-pointer accent-[#7d7164]"
                id="isSeller"
                name="isSeller"
                type="checkbox"
              />
              <label
                className="text-[11px] uppercase tracking-wider text-stone-600 cursor-pointer select-none"
                htmlFor="isSeller"
              >
                Register as a Seller
              </label>
            </div>

            {/* Action Button */}
            <div className="pt-2 md:pt-4">
              <button
                disabled={isLoading}
                className="w-full bg-[#827668] cursor-pointer text-[#FFFFFF] text-[11px] uppercase tracking-[0.2em] py-2.5 md:py-3 rounded-full hover:bg-[#6c6155] disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98]"
                type="submit"
              >
                {isLoading ? "Signing up..." : "Create Account"}
              </button>
            </div>

            {/* Redirect */}
            <div className="text-center mt-3 md:mt-4">
              <p className="text-[11px] text-stone-500">
                Already a member?{" "}
                <Link
                  className="text-[#1A1C19] font-medium cursor-pointer hover:text-[#827668] transition-colors duration-300 ml-1"
                  to="/login"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-4 md:mt-8 flex justify-between items-center opacity-40">
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

export default Register;
