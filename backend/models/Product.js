import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },

    image: { type: String, required: true },
    images: [{ type: String }],

    badge: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    stock: { type: Number, default: 0 },

    isFlashSale: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

// Keep the discount badge in sync with the prices.
productSchema.pre("save", function (next) {
  this.discountPercent =
    this.oldPrice > this.price
      ? Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100)
      : 0;
  next();
});

export default mongoose.model("Product", productSchema);
