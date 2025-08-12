import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import vendorRoutes from "./routes/vendorRoutes.js"; // Import your vendor routes

const vendorServices = require('../services/vendorServices');

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
      const updatedVendor = await vendorServices.updateVendor(req.params.id, req.body);
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
};

export default vendorController;
import dotenv from "dotenv";
dotenv.config();