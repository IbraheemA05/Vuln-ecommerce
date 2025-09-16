import Joi from 'joi';
import Product from '../models/Product.js';



// Get all products for the logged-in vendor
export const getMyProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find({ vendor: req.user.id }).skip(skip).limit(limit);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Create a new product tied to the logged-in vendor
export const createProduct = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body); // Validate input
    if (error) return res.status(400).json({ message: error.details[0].message });
    const newProduct = await Product.create({
      ...value,
      vendor: req.user.id, // Automatically link product to vendor
    });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

// Get a single product (only if vendor owns it)
export const getProductById = async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findOne({ _id: req.params.id, vendor: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

//Get product by Categories 
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!category) return res.status(400).json({ message: "Category is required" });
    const safeCategory = category.trim();
    const products = await Product.find({ category: safeCategory });
    if (!products.length) return res.status(404).json({ message: "No products found in this category" });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Update product only if vendor owns it
export const updateMyProduct = async (req, res, next) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(403).json({ message: "Unauthorized or not found" });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete product only if vendor owns it
export const deleteMyProduct = async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const deleted = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!deleted) return res.status(403).json({ message: "Unauthorized or not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};


// Get all products (public browsing)
export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
