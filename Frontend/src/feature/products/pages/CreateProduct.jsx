import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { useProduct } from "../hooks/useProduct";

function CreateProduct() {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    // Only accepting first few files for simplicity, or appending
    const mappedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prev) => [...prev, ...mappedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeFile = (name) => {
    setFiles((files) => files.filter((f) => f.name !== name));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.title || !formData.priceAmount) {
      setError("Title and Price are required.");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      files.forEach((file) => {
        data.append("images", file);
      });

      await handleCreateProduct(data);
      // On success, redirect to dashboard
      navigate("/seller");
    } catch (err) {
      setError(err?.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen md:h-screen flex flex-col md:flex-row bg-[#FAF8F5] text-[#1A1C19] font-sans antialiased overflow-y-auto md:overflow-hidden">
      {/* Design Column */}
      <div className="hidden md:block md:w-[45%] relative bg-[#EAE8E3]">
        <img
          className="absolute inset-0 w-full h-full object-cover grayscale-[10%] brightness-[0.95]"
          alt="Creative creation"
          src="/outfy-fashion-model.png"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-12">
          <Link
            to="/seller"
            className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-white">
            <h2 className="font-serif text-5xl mb-3 tracking-tighter italic">
              Create
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/80">
              Add a new piece to your collection
            </p>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="w-full md:w-[55%] flex flex-col py-8 px-6 md:px-16 lg:px-24 bg-[#FAF8F5] overflow-y-auto">
        <div className="md:hidden mb-8">
          <Link
            to="/seller"
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#1A1C19]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="max-w-xl w-full mx-auto pb-12">
          <header className="mb-10">
            <h1 className="font-serif text-3xl mb-2 tracking-tighter text-[#1A1C19]">
              Product Details
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-stone-500">
              Provide the essential details for your listing.
            </p>
          </header>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="group">
              <label
                className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                htmlFor="title"
              >
                Title
              </label>
              <input
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-400 focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164] transition-colors duration-300"
                id="title"
                name="title"
                placeholder="e.g. Minimalist Linen Shirt"
                type="text"
                required
              />
            </div>

            {/* Description */}
            <div className="group">
              <label
                className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-400 focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164] transition-colors duration-300 resize-none"
                id="description"
                name="description"
                placeholder="Tell the story of this piece..."
              />
            </div>

            {/* Price Area */}
            <div className="flex gap-6">
              <div className="group w-1/3">
                <label
                  className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                  htmlFor="priceCurrency"
                >
                  Currency
                </label>
                <select
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b py-2 pl-0 pr-6 text-sm text-[#1A1C19] focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164] transition-colors duration-300 appearance-none bg-no-repeat bg-right disabled:opacity-50"
                  id="priceCurrency"
                  name="priceCurrency"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="group flex-1">
                <label
                  className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1"
                  htmlFor="priceAmount"
                >
                  Amount
                </label>
                <input
                  value={formData.priceAmount}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-400 focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164] transition-colors duration-300"
                  id="priceAmount"
                  name="priceAmount"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div className="group">
              <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-3">
                Images
              </label>
              <div
                {...getRootProps()}
                className={`border border-dashed p-8 text-center cursor-pointer transition-colors duration-300 ${
                  isDragActive
                    ? "border-[#1A1C19] bg-stone-100/50"
                    : "border-stone-300 hover:border-[#1A1C19] hover:bg-stone-50"
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="w-6 h-6 mx-auto mb-3 text-stone-400" />
                <p className="text-xs text-stone-600 font-medium">
                  Click or drag images here
                </p>
                <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">
                  PNG, JPG up to 5MB
                </p>
              </div>

              {/* Previews */}
              {files.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="relative aspect-square bg-stone-100 rounded-sm overflow-hidden group/thumb"
                    >
                      <img
                        src={file.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(file.name)}
                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 flex justify-end">
              <button
                disabled={isLoading}
                className="w-full sm:w-auto bg-[#827668] text-white text-[11px] uppercase tracking-[0.2em] py-3.5 px-10 rounded-full hover:bg-[#6c6155] disabled:opacity-75 transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                type="submit"
              >
                {isLoading ? "Saving..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateProduct;
