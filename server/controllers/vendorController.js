import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import vendorRoutes from "../routes/vendorRoutes.js"; // Import your vendor routes
import vendorServices from "../services/vendorServices.js";

const vendorController = {
  getVendor: async (req, res, next) => {
    try {
      const vendor = await vendorServices.getVendorById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      next(error);
    }
  },
  createVendor: async (req, res, next) => {
    try {
      const newVendor = await vendorServices.createVendor(req.body);
      res.status(201).json(newVendor);
    } catch (error) {
      next(error);
    }
  },
  updateVendor: async (req, res, next) => {
    try {
      const updatedVendor = await vendorServices.updateVendor(
        req.params.id,
        req.body
      );
      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(updatedVendor);
    } catch (error) {
      next(error);
    }
  },
  deleteVendor: async (req, res, next) => {
    try {
      const deletedVendor = await vendorServices.deleteVendor(req.params.id);
      if (!deletedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Profile Management Methods (for authenticated vendors)
  getMyVendorProfile: async (req, res, next) => {
    try {
      // Assuming vendor ID comes from authentication middleware
      const vendorId = req.vendor?.id || req.user?.id;
      if (!vendorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const vendor = await vendorServices.getVendorProfile(vendorId);
      res.json(vendor);
    } catch (error) {
      next(error);
    }
  },

  updateMyVendorProfile: async (req, res, next) => {
    try {
      const vendorId = req.vendor?.id || req.user?.id;
      if (!vendorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const updatedVendor = await vendorServices.updateVendorProfile(vendorId, req.body);
      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(updatedVendor);
    } catch (error) {
      next(error);
    }
  },

  deleteMyVendorAccount: async (req, res, next) => {
    try {
      const vendorId = req.vendor?.id || req.user?.id;
      if (!vendorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const deletedVendor = await vendorServices.deleteVendorAccount(vendorId);
      res.json({ message: "Vendor account deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  // Additional useful methods
  getAllVendors: async (req, res, next) => {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        category: req.query.category,
        isVerified: req.query.isVerified === 'true',
        isActive: req.query.isActive !== 'false',
        search: req.query.search
      };

      const result = await vendorServices.getAllVendors(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getVendorProducts: async (req, res, next) => {
    try {
      const vendorId = req.params.id;
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        category: req.query.category,
        isAvailable: req.query.isAvailable !== 'false'
      };

      const result = await vendorServices.getVendorProducts(vendorId, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  getVendorStats: async (req, res, next) => {
    try {
      const vendorId = req.params.id || req.vendor?.id || req.user?.id;
      if (!vendorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const stats = await vendorServices.getVendorStats(vendorId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
};

export default vendorController;
