import orderTemplate from "../templates/Order.js";
import Order from "../models/Order.js";
import nodemailer from "nodemailer";

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email helper
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

// Sample price calculation function
const calculateTotal = async (products) => {
  return products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
};

// Order placement controller
export const placeOrder = async (req, res) => {
  try {
    const { vendor, products, address } = req.body;
    const totalAmount = await calculateTotal(products);

    const newOrder = new Order({
      customer: req.user._id,
      vendor,
      products,
      totalAmount,
      address,
    });

    await newOrder.save();

    const htmlContent = orderTemplate({
      username: req.user.name,
      orderDetails: products,
      orderId: newOrder._id,
    });

    await sendEmail({
      to: req.user.email,
      subject: "Order Confirmation",
      html: htmlContent,
    });

    res.status(201).json({ message: "Order placed", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order", error });
  }
};

const trackorder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "username")
      .populate("vendor", "shopName")
      .populate("products.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: ensure only the customer, vendor, or agent can view it
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order", err });
  }
};
