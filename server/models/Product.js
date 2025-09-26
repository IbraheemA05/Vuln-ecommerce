import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: 3, 
    maxlength: 100 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0.01, 
    max: 1000000 // Reasonable upper limit
  },
  description: { 
    type: String, 
    maxlength: 500, // Prevent oversized data
    default: "" 
  },
  image: { 
    type: String, 
    maxlength: 200, // URL length limit
    default: "" 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ["electronics", "clothing", "books", "other"], // Predefined categories
    trim: true 
  },
  stock: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 10000 // Prevent unrealistic stock
  },
  ratings: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 // Standard rating scale
  },
  reviews: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
      comment: { 
        type: String, 
        maxlength: 200, 
        default: "", 
        // Add sanitization in controller or middleware
      },
      rating: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 5 
      },
      createdAt: { 
        type: Date, 
        default: Date.now 
      },
    },
    { _id: false } // Optimize by disabling subdoc IDs if not needed
  ],
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Changed to User for consistency with authController
    required: true,
    index: true // Improve query performance
  },
}, { 
  timestamps: true,
  // Add index for frequent queries
  indexes: [{ key: { category: 1 } }],
  // Prevent arbitrary fields
  strict: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;