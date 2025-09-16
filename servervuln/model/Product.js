import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  image: String,
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: String,
      rating: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  // Assuming you have a Vendor model to reference
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
