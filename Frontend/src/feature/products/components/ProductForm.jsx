import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, Image as ImageIcon, X, Plus, Trash2 } from "lucide-react";

const GENDERS = ["Men", "Women", "Kids", "Unisex"];
const CATEGORIES = ["T-Shirt", "Shirt", "Bottoms", "Outerwear", "Dress", "Activewear", "Accessories", "Other"];
const FITS = ["Slim", "Regular", "Oversized", "Relaxed"];
const PATTERNS = ["Solid", "Printed", "Striped", "Checked", "Graphic"];
const OCCASIONS = ["Casual", "Formal", "Party", "Streetwear", "Athleisure"];
const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

export default function ProductForm({ initialData, onSubmit, isLoading, title, subtitle, error }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brandName: "",
    category: "T-Shirt",
    gender: "Unisex",
    originalPrice: "",
    discountPercentage: 0,
    currency: "INR",
    fabric: "",
    fit: "",
    pattern: "",
    sleeveType: "",
    occasion: [],
    tags: [],
    careInstructions: "",
    returnPolicy: "",
    deliveryInfo: "",
    isActive: true,
    isFeatured: false,
    sizes: [{ size: "M", stock: 10 }],
  });

  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        title: initialData.title || "",
        description: initialData.description || "",
        brandName: initialData.brandName || "",
        category: initialData.category || "T-Shirt",
        gender: initialData.gender || "Unisex",
        originalPrice: initialData.originalPrice || "",
        discountPercentage: initialData.discountPercentage || 0,
        currency: initialData.currency || "INR",
        fabric: initialData.fabric || "",
        fit: initialData.fit || "",
        pattern: initialData.pattern || "",
        sleeveType: initialData.sleeveType || "",
        occasion: initialData.occasion || [],
        tags: initialData.tags || [],
        careInstructions: initialData.careInstructions || "",
        returnPolicy: initialData.returnPolicy || "",
        deliveryInfo: initialData.deliveryInfo || "",
        isActive: initialData.isActive ?? true,
        isFeatured: initialData.isFeatured ?? false,
        sizes: initialData.sizes && initialData.sizes.length > 0
          ? initialData.sizes
          : prev.sizes
      }));
      if (initialData.images) {
        setExistingImages(initialData.images);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOccasionChange = (occ) => {
    setFormData((prev) => {
      const isSelected = prev.occasion.includes(occ);
      if (isSelected) {
        return { ...prev, occasion: prev.occasion.filter((o) => o !== occ) };
      } else {
        return { ...prev, occasion: [...prev.occasion, occ] };
      }
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // --- Sizes Handlers ---
  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", stock: 0 }],
    }));
  };

  const removeSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleSizeChange = (index, field, value) => {
    setFormData((prev) => {
      const newSizes = [...prev.sizes];
      newSizes[index] = { ...newSizes[index], [field]: field === "stock" ? Number(value) : value };
      return { ...prev, sizes: newSizes };
    });
  };

  // --- Images Handlers ---
  const onDrop = useCallback((acceptedFiles) => {
    const mappedFiles = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setFiles((prev) => [...prev, ...mappedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeFile = (name) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== name));
  };

  const removeExistingImage = (url) => {
    setRemovedImages((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((img) => img.url !== url));
  };

  const submitForm = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "sizes" || key === "tags" || key === "occasion") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    files.forEach((file) => {
      data.append("images", file);
    });

    if (removedImages.length > 0) {
      data.append("removedImages", JSON.stringify(removedImages));
    }

    onSubmit(data);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-[35%_65%] h-screen w-screen overflow-hidden bg-[#FAF8F5] text-[#1A1C19] font-sans antialiased m-0 p-0 fixed inset-0">
      {/* Design Column */}
      <div className="hidden md:block relative bg-[#EAE8E3] h-full overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover grayscale-[10%] brightness-[0.9]"
          alt="Create"
          src="/outfy-fashion-model.png"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-12">
          <Link
            to="/seller"
            className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-white">
            <h2 className="font-serif text-5xl mb-3 tracking-tighter italic">
              {title.split(' ')[0]}
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/80">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="h-full w-full relative bg-[#FAF8F5] overflow-y-auto">
        <div className="flex flex-col py-8 px-6 md:px-12 lg:px-20 min-h-full">
          <div className="md:hidden mb-8">
            <Link to="/seller" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#1A1C19]">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>

          <div className="max-w-3xl w-full mx-auto pb-12">
            <header className="mb-8 border-b border-[#EAE8E3] pb-6">
              <h1 className="font-serif text-3xl mb-2 tracking-tighter text-[#1A1C19]">{title}</h1>
            </header>

            {error && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-12">

              {/* Section 1: Basic Information */}
              <section className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-[#827668] font-bold">1. Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Title *</label>
                    <input
                      value={formData.title} onChange={handleChange} name="title" required
                      className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-300 focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164]"
                      placeholder="Minimalist Linen Shirt"
                    />
                  </div>
                  <div className="group md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Description *</label>
                    <textarea
                      value={formData.description} onChange={handleChange} name="description" rows={3} required
                      className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-300 focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164] resize-none"
                      placeholder="Tell the story of this piece..."
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Brand Name</label>
                    <input
                      value={formData.brandName} onChange={handleChange} name="brandName"
                      className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] placeholder:text-stone-300 focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164]"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Category *</label>
                    <select
                      value={formData.category} onChange={handleChange} name="category" required
                      className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] focus:outline-none focus:ring-0 border-stone-300 focus:border-[#7d7164]"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="group md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-3">Gender *</label>
                    <div className="flex gap-4">
                      {GENDERS.map(g => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="accent-[#1A1C19]" />
                          <span className="text-sm font-medium">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Pricing */}
              <section className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-[#827668] font-bold">2. Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Original Price ({formData.currency}) *</label>
                    <input
                      type="number" min="0" step="0.01" value={formData.originalPrice} onChange={handleChange} name="originalPrice" required
                      className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] focus:outline-none border-stone-300 focus:border-[#7d7164]"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Discount %</label>
                    <input
                      type="number" min="0" max="100" value={formData.discountPercentage} onChange={handleChange} name="discountPercentage"
                      className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm text-[#1A1C19] focus:outline-none border-stone-300 focus:border-[#7d7164]"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Calculated Final</label>
                    <div className="py-2 text-sm text-stone-400">
                      {formData.originalPrice ? Math.round(formData.originalPrice - (formData.originalPrice * (formData.discountPercentage / 100))) : "0"}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Sizes & Inventory */}
              <section className="space-y-6 bg-white p-6 rounded-2xl border border-stone-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#827668] font-bold">3. Sizes & Inventory *</h3>
                  <button type="button" onClick={addSize} className="text-[10px] flex items-center gap-1 uppercase tracking-widest text-[#1A1C19] hover:text-[#827668] font-bold bg-stone-100 px-3 py-1.5 rounded-full">
                    <Plus className="w-3 h-3" /> Add Size
                  </button>
                </div> 

                 {formData.sizes.map((s, sIndex) => (
                  <div key={sIndex} className="bg-[#FAF8F5] p-5 rounded-xl border border-stone-200 relative mb-4">
                    {formData.sizes.length > 1 && (
                      <button type="button" onClick={() => removeSize(sIndex)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1.5 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Size *</label>
                          <select
                            value={s.size} onChange={(e) => handleSizeChange(sIndex, "size", e.target.value)} required
                            className="w-full bg-white border py-1.5 px-3 text-sm rounded-lg outline-none focus:border-[#7d7164]"
                          >
                            <option value="">Select Size...</option>
                            {COMMON_SIZES.map(cs => <option value={cs} key={cs}>{cs}</option>)}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Stock Qty *</label>
                          <input
                            type="number" min="0" placeholder="Qty" value={s.stock} onChange={(e) => handleSizeChange(sIndex, "stock", e.target.value)} required
                            className="w-full bg-white border py-1.5 px-3 text-sm rounded-lg outline-none focus:border-[#7d7164]"
                          />
                        </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Section 4: Images */}
              <section className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-[#827668] font-bold">4. Product Imagery</h3>
                <div
                  {...getRootProps()}
                  className={`border border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? "border-[#1A1C19] bg-stone-100/50" : "border-stone-300 hover:border-[#1A1C19] hover:bg-stone-50"
                    }`}
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="w-8 h-8 mx-auto mb-3 text-stone-400" />
                  <p className="text-sm font-medium text-stone-600">Drag & Drop Universal Images Here</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 mt-1">PNG, JPG up to 5MB</p>
                </div>

                {/* Previews */}
                {(files.length > 0 || existingImages.length > 0) && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                    {existingImages.map((img) => (
                      <div key={img.url} className="relative aspect-[3/4] bg-stone-100 rounded overflow-hidden group">
                        <img src={img.url} alt="existing" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(img.url)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {files.map((file) => (
                      <div key={file.name} className="relative aspect-[3/4] bg-stone-100 rounded overflow-hidden group">
                        <img src={file.preview} alt="preview" className="w-full h-full object-cover" onLoad={() => URL.revokeObjectURL(file.preview)} />
                        <button type="button" onClick={() => removeFile(file.name)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Section 5: Specs & Tags */}
              <section className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-[#827668] font-bold">5. Attributes & Tags</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Fit</label>
                    <select value={formData.fit} onChange={handleChange} name="fit" className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm focus:outline-none border-stone-300">
                      <option value="">Select Fit</option>
                      {FITS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Pattern</label>
                    <select value={formData.pattern} onChange={handleChange} name="pattern" className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm focus:outline-none border-stone-300">
                      <option value="">Select Pattern</option>
                      {PATTERNS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Fabric</label>
                    <input value={formData.fabric} onChange={handleChange} name="fabric" className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm focus:outline-none border-stone-300" placeholder="e.g. 100% Cotton" />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Sleeve Type</label>
                    <input value={formData.sleeveType} onChange={handleChange} name="sleeveType" className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm focus:outline-none border-stone-300" placeholder="e.g. Half Sleeve" />
                  </div>
                  <div className="group md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-3">Occasion</label>
                    <div className="flex flex-wrap gap-2">
                      {OCCASIONS.map(occ => (
                        <label key={occ} className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer select-none transition-colors ${formData.occasion.includes(occ) ? 'bg-[#1A1C19] text-white border-[#1A1C19]' : 'bg-white text-stone-600 border-stone-200 hover:border-[#1A1C19]'}`}>
                          <input type="checkbox" className="hidden" checked={formData.occasion.includes(occ)} onChange={() => handleOccasionChange(occ)} />
                          {occ}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="group md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">Search Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-[#dff0e6] text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          {tag} <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <input
                      value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown}
                      className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm focus:outline-none border-stone-300"
                      placeholder="Type tag and press Enter..."
                    />
                  </div>
                </div>
              </section>

              {/* Section 6: Operations & Policies */}
              <section className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest text-[#827668] font-bold">6. Operations & Policies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Care Instructions</label>
                    <textarea value={formData.careInstructions} onChange={handleChange} name="careInstructions" rows={2} className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm focus:outline-none border-stone-300 resize-none" placeholder="..." />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Return Policy</label>
                    <textarea value={formData.returnPolicy} onChange={handleChange} name="returnPolicy" rows={2} className="w-full bg-transparent border-0 border-b py-2 px-0 text-sm focus:outline-none border-stone-300 resize-none" placeholder="e.g. 7-Day Returns if unused" />
                  </div>

                  <div className="group md:col-span-2 pt-4 flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-[#1A1C19]" />
                      <span className="text-sm font-semibold">Active Listing</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-[#1A1C19]" />
                      <span className="text-sm font-semibold">Featured Listing</span>
                    </label>
                  </div>
                </div>
              </section>

              <div className="pt-10 flex justify-end gap-4 border-t border-[#EAE8E3] sticky bottom-0 bg-[#FAF8F5] pb-8 md:pb-0 z-10 p-2">
                <Link to="/seller" className="px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-stone-500 hover:text-[#1A1C19]">
                  Cancel
                </Link>
                <button
                  disabled={isLoading}
                  className="bg-[#827668] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-3.5 px-10 rounded-full hover:bg-[#6c6155] disabled:opacity-75 transition-all duration-300"
                  type="submit"
                >
                  {isLoading ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
