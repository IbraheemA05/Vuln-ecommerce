import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendEmail from "../utils/sendEmail.js";
import { loginSchema } from "../Validators/authValidator.js";
import { signupSchema } from "../Validators/authValidator.js";
import passwordResetTemplate from "../templates/passwordreset.js";
import registerTemplate from "../templates/register.js";

// Transport for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Login handler
export const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
    // Validate username and password
    const { username, password } = value;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    const user = await User.findOne({ username: value.username.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "0.5h" }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// Signup handler
export const signup = async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let { username, email, password, role } = value;
    username = username.toLowerCase();
    email = email.toLowerCase();

    const roles = ["admin", "vendor", "customer"];
    if (!roles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin role cannot be assigned through signup.",
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email Not available,try another." });
    }

    // No need for extra regex check if handled in Joi schema
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    // Send welcome email after successful registration
    const htmlcontent = registerTemplate(newUser.username);
    await sendEmail({
      to: newUser.email,
      subject: "Welcome to Swift Errand!",
      html: htmlcontent,
    });

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Password Reset handler
export const resetPassword = async (req, res, next) => {
  const { email, token, newPassword } = req.body;
  try {
    // Step 1: Request password reset (send email)
    if (email && !token && !newPassword) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "404: ERROR" });
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
      const resetBaseUrl =
        process.env.RESET_BASE_URL || "https://yourfrontend.com/reset-password";
      const resetUrl = `${resetBaseUrl}/${resetToken}`;
      // Use HTML email template
        const htmlcontent = passwordResetTemplate(user.username || "User", resetUrl);
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: htmlcontent,
      });
      return res.json({ message: "Password reset link sent to your email." });
    }
    // Step 2: Reset password using token and new password
    if (token && newPassword) {
      const userWithToken = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!userWithToken)
        return res.status(400).json({ message: "Invalid or expired token." });
      userWithToken.password = await bcrypt.hash(newPassword, 10);
      userWithhToken.resetPasswordToken = undefined;
      userWithToken.resetPasswordExpires = undefined;
      await userWithToken.save();
      return res.json({ message: "Password reset successfully." });
    }
    return res.status(400).json({ message: "Invalid request." });
  } catch (error) {
    next(error);
  }
};

// Logout handler
export const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

