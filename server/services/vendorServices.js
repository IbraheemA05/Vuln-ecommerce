import mongoose from "mongoose";
import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";

const vendorServices = {
  // Core CRUD Operations
  async getVendorById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid vendor ID");
      }
      
      const vendor = await Vendor.findById(id)
        .populate('products')
        .select('-password -bankDetails');
      
      if (!vendor || vendor.isDeleted) {
        return null;
      }
      
      return vendor;
    } catch (error) {
      throw new Error(`Error fetching vendor: ${error.message}`);
    }
  },

  async createVendor(vendorData) {
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'password', 'businessName', 'businessCategory', 'businessLicense'];
      for (const field of requiredFields) {
        if (!vendorData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Check if vendor with email already exists
      const existingVendor = await Vendor.findOne({ 
        email: vendorData.email.toLowerCase(),
        isDeleted: false 
      });
      
      if (existingVendor) {
        throw new Error("Vendor with this email already exists");
      }

      const vendor = new Vendor(vendorData);
      await vendor.save();
      
      // Return vendor without sensitive data
      return vendor.toJSON();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("Vendor with this email already exists");
      }
      throw new Error(`Error creating vendor: ${error.message}`);
    }
  },

  async updateVendor(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid vendor ID");
      }

      // Remove sensitive fields from update data
      const { password, bankDetails, ...safeUpdateData } = updateData;
      
      const vendor = await Vendor.findByIdAndUpdate(
        id,
        { ...safeUpdateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password -bankDetails');

      if (!vendor || vendor.isDeleted) {
        return null;
      }

      return vendor;
    } catch (error) {
      throw new Error(`Error updating vendor: ${error.message}`);
    }
  },

  async deleteVendor(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid vendor ID");
      }

      // Soft delete - mark as deleted instead of removing
      const vendor = await Vendor.findByIdAndUpdate(
        id,
        { 
          isDeleted: true, 
          isActive: false,
          deletedAt: new Date() 
        },
        { new: true }
      ).select('-password -bankDetails');

      return vendor;
    } catch (error) {
      throw new Error(`Error deleting vendor: ${error.message}`);
    }
  },

  // Profile Management (for authenticated vendors)
  async getVendorProfile(vendorId) {
    try {
      const vendor = await this.getVendorById(vendorId);
      if (!vendor) {
        throw new Error("Vendor not found");
      }
      return vendor;
    } catch (error) {
      throw new Error(`Error fetching vendor profile: ${error.message}`);
    }
  },

  async updateVendorProfile(vendorId, profileData) {
    try {
      return await this.updateVendor(vendorId, profileData);
    } catch (error) {
      throw new Error(`Error updating vendor profile: ${error.message}`);
    }
  },

  async deleteVendorAccount(vendorId) {
    try {
      // Also deactivate all vendor's products
      await Product.updateMany(
        { vendor: vendorId },
        { isAvailable: false, isDeleted: true }
      );

      return await this.deleteVendor(vendorId);
    } catch (error) {
      throw new Error(`Error deleting vendor account: ${error.message}`);
    }
  },

  // Additional Service Methods
  async getAllVendors(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        isVerified,
        isActive = true,
        search
      } = filters;

      const query = { isDeleted: false };
      
      if (isActive !== undefined) query.isActive = isActive;
      if (isVerified !== undefined) query.isVerified = isVerified;
      if (category) query.businessCategory = category;
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { businessName: { $regex: search, $options: 'i' } },
          { businessDescription: { $regex: search, $options: 'i' } }
        ];
      }

      const vendors = await Vendor.find(query)
        .select('-password -bankDetails')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Vendor.countDocuments(query);

      return {
        vendors,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(`Error fetching vendors: ${error.message}`);
    }
  },

  async getVendorProducts(vendorId, filters = {}) {
    try {
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        throw new Error("Invalid vendor ID");
      }

      const {
        page = 1,
        limit = 10,
        category,
        isAvailable = true
      } = filters;

      const query = { 
        vendor: vendorId,
        isDeleted: false
      };
      
      if (isAvailable !== undefined) query.isAvailable = isAvailable;
      if (category) query.category = category;

      const products = await Product.find(query)
        .populate('vendor', 'name businessName')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments(query);

      return {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      throw new Error(`Error fetching vendor products: ${error.message}`);
    }
  },

  async searchVendors(searchCriteria) {
    try {
      const {
        query,
        category,
        location,
        rating,
        isVerified = true
      } = searchCriteria;

      const searchQuery = {
        isDeleted: false,
        isActive: true
      };

      if (isVerified !== undefined) searchQuery.isVerified = isVerified;
      if (category) searchQuery.businessCategory = category;
      if (rating) searchQuery.rating = { $gte: rating };
      
      if (location) {
        searchQuery.$or = [
          { 'address.city': { $regex: location, $options: 'i' } },
          { 'address.state': { $regex: location, $options: 'i' } }
        ];
      }

      if (query) {
        const textSearchConditions = [
          { name: { $regex: query, $options: 'i' } },
          { businessName: { $regex: query, $options: 'i' } },
          { businessDescription: { $regex: query, $options: 'i' } }
        ];

        if (searchQuery.$or) {
          searchQuery.$and = [
            { $or: searchQuery.$or },
            { $or: textSearchConditions }
          ];
          delete searchQuery.$or;
        } else {
          searchQuery.$or = textSearchConditions;
        }
      }

      const vendors = await Vendor.find(searchQuery)
        .select('-password -bankDetails')
        .sort({ rating: -1, totalReviews: -1 });

      return vendors;
    } catch (error) {
      throw new Error(`Error searching vendors: ${error.message}`);
    }
  },

  async validateVendorData(data) {
    const errors = [];

    // Basic validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (!data.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      errors.push("Valid email is required");
    }

    if (!data.phone || !/^\+?[\d\s-()]+$/.test(data.phone)) {
      errors.push("Valid phone number is required");
    }

    if (!data.businessName || data.businessName.trim().length < 2) {
      errors.push("Business name must be at least 2 characters long");
    }

    if (!data.businessCategory) {
      errors.push("Business category is required");
    }

    if (data.website && !/^https?:\/\/.+/.test(data.website)) {
      errors.push("Website must be a valid URL");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Vendor Statistics
  async getVendorStats(vendorId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        throw new Error("Invalid vendor ID");
      }

      const vendor = await Vendor.findById(vendorId);
      if (!vendor || vendor.isDeleted) {
        throw new Error("Vendor not found");
      }

      const productStats = await Product.aggregate([
        { $match: { vendor: new mongoose.Types.ObjectId(vendorId), isDeleted: false } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            availableProducts: { $sum: { $cond: ["$isAvailable", 1, 0] } },
            averageRating: { $avg: "$ratings" },
            totalStock: { $sum: "$stock" }
          }
        }
      ]);

      const stats = productStats[0] || {
        totalProducts: 0,
        availableProducts: 0,
        averageRating: 0,
        totalStock: 0
      };

      return {
        ...stats,
        vendorRating: vendor.rating,
        totalReviews: vendor.totalReviews,
        totalSales: vendor.totalSales,
        joinedDate: vendor.createdAt,
        isVerified: vendor.isVerified
      };
    } catch (error) {
      throw new Error(`Error fetching vendor stats: ${error.message}`);
    }
  }
};

export default vendorServices;