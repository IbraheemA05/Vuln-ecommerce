import Product from '../models/Product.js';

// Get all products for the logged-in vendor
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ vendor: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Create a new product tied to the logged-in vendor
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create({
      ...req.body,
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
    const products = await Product.find({ category: category });
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
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
