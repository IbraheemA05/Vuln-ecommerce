import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendEmail from "../utils/sendEmail.js";
import { loginSchema } from "../Validators/authValidator.js";
import { signupSchema } from "../Validators/authValidator.js";
import { resetPasswordSchema } from "../Validators/authValidator.js";
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
    // Redirect the user to the login page
    return res.status(200).json({
      message: "Login successful. Redirecting to home...",
      redirectUrl: "/"
    });
  } catch (error) {
    next(error);
  }
};



// Signup handler
export const signup = async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);

    let { username, email, password, role } = value
    username = username.toLowerCase();
    email = email.toLowerCase();

    const roles = ["admin", "vendor", "customer"];
    if (!roles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }
    if (role === "admin") {
      return res.status(403).json({
        message: "Admin role cannot be assigned through signup{Try again with vendor or customer role}"
      });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already choosen this username" });
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
    return res.status(500).json({ message: "Error creating user", error });
  }
};


// Password Reset handler
export const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { email, token, newPassword } = value;
    if (email && !token && !newPassword) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(200).json({ message: "If an account exists, a reset link will be sent" });
      }
      user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
      const resetUrl = `${process.env.RESET_BASE_URL || "https://yourfrontend.com/reset-password"}/${user.resetPasswordToken}`;
      const htmlcontent = passwordResetTemplate(user.username || "User", resetUrl);
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: htmlcontent,
      });
      return res.json({ message: "Password reset link sent" });
    }
    if (token && newPassword) {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) return res.status(400).json({ message: "Invalid or expired token" });
      user.password = newPassword; // Hashed by schema
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.json({ message: "Password reset successfully" });
    }
    return res.status(400).json({ message: "Invalid request" });
  } catch (error) {
    next(error);
  }
};

// Logout handler
export const logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};


export const getProfile = async (req, res, next) =>{
  try{
    const user = await User.findById(req.user.id).select("-password").lean;
    if(!User) return res.status(404).json({"message":"User Not Found"})
    res.json(user);
  }
    catch(error){
      next(error)
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    if (value.role) return res.status(403).json({ message: "Cannot update role" });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: value },
      { new: true, runValidators: true }
    ).select("username email role").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }).select("username email role").lean();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { error, value } = updateRoleSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { userId, role } = value;
    if (req.user.id === userId) return res.status(403).json({ message: "Cannot change own role" });
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("username email role").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};


// NOTE 
// This project is to demonstrate secure coding practice by comparing both secure and vulnerable code together.
// In respect to that, some modules will not be added in order to keep the project simple and easy to understand.
//Such Modules are :
//  HELMENT MODULE 
//   REF : https://helmetjs.github.io/
//   Function :  Protect against common web vulnerabilities by setting HTTP headers appropriately.
