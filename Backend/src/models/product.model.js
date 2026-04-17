import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    brandName: { type: String },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids", "Unisex"],
    },

    // Pricing
    originalPrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number }, // Auto-calculated
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR"],
      default: "INR",
    },

    // Sizes and Inventory
    sizes: [sizeSchema],

    // Universal images
    images: [
      {
        url: { type: String, required: true },
      },
    ],

    // Extra Attributes
    fabric: { type: String },
    fit: {
      type: String,
      enum: ["Slim", "Regular", "Oversized", "Relaxed", ""],
    },
    pattern: {
      type: String,
      enum: ["Solid", "Printed", "Striped", "Checked", "Graphic", ""],
    },
    sleeveType: { type: String },
    occasion: [{ type: String }],
    tags: [{ type: String }],
    careInstructions: { type: String },
    returnPolicy: { type: String },
    deliveryInfo: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Pre-save calculate finalPrice and create slug
productSchema.pre("save", function () {
  if (this.originalPrice != null) {
    const discount = this.discountPercentage || 0;
    this.finalPrice = Math.round(
      this.originalPrice - this.originalPrice * (discount / 100),
    );
  }

  if (this.title && (this.isModified("title") || !this.slug)) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    this.slug = baseSlug + "-" + Math.floor(Math.random() * 10000);
  }
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
