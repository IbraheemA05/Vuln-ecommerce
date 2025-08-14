import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, "Vendor name is required"],
    trim: true,
    maxlength: [100, "Vendor name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },

  // Business Information
  businessName: {
    type: String,
    required: [true, "Business name is required"],
    trim: true,
    maxlength: [150, "Business name cannot exceed 150 characters"]
  },
  businessDescription: {
    type: String,
    maxlength: [1000, "Business description cannot exceed 1000 characters"]
  },
  businessCategory: {
    type: String,
    required: [true, "Business category is required"],
    enum: ["Electronics", "Clothing", "Food", "Books", "Home & Garden", "Sports", "Health", "Other"]
  },
  businessLicense: {
    type: String,
    required: [true, "Business license is required"]
  },

  // Address Information
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: "USA" }
  },

  // Business Metrics
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalProducts: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },

  // Status Fields
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // Additional Information
  website: {
    type: String,
    match: [/^https?:\/\/.+/, "Please enter a valid website URL"]
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },
  bankDetails: {
    accountNumber: String,
    routingNumber: String,
    bankName: String
  },

  // Verification
  verificationDocuments: [{
    type: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
vendorSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Virtual for products
vendorSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'vendor'
});

// Index for better performance
vendorSchema.index({ email: 1 });
vendorSchema.index({ businessName: 1 });
vendorSchema.index({ businessCategory: 1 });
vendorSchema.index({ isActive: 1, isVerified: 1 });

// Pre-save middleware to hash password (if using bcrypt)
vendorSchema.pre('save', function(next) {
  // Password hashing would go here if using bcrypt
  // For now, we'll skip this as it depends on your auth implementation
  next();
});

// Method to exclude password from JSON output
vendorSchema.methods.toJSON = function() {
  const vendor = this.toObject();
  delete vendor.password;
  delete vendor.bankDetails;
  return vendor;
};

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
