import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
//import { loginSchema } from "../Validators/authValidator.js";
//import { signupSchema } from "../Validators/authValidator.js";
//import passwordResetTemplate from "../templates/passwordreset.js";
//import registerTemplate from "../templates/register.js";

// Transport for nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

//Login Handler
export const login = async (req, res, next) => {
  let {username , password ,role } = req.body;
  if(!username || !password || !role){
    return res.status(400).json({message:"All fields are required"});
  }
  const user = await User.findOne({
    username: username.toLowerCase(),
    password: password,
  });
  if(!user){
    return res.status(400).json({message:"Invalid credentials, try out the password for sql injection"});
  }
  const  token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET);
  return res.json({token});
}
   
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

     // Redirect the user to the login page
     return res.status(200).json({
      message: "User created successfully. Redirecting to login...",
      redirectUrl: "/home"
    });
  } 
  catch (error) {
    return res.status(500).json({ message: "Error creating user", error });
  }
};


export const passwordReset = async (req, res, next) => {
  const { email, token, newPassword } = req.body;
  try {
    if (email && !token && !newPassword) {
      const user = await User.findOne({ email });
      if (!user) return res.status(200).json({ message: "400 : User not Found" });
      const resetToken = new Date().getTime().toString(36);
      user.resetPasswordToken = resetToken;
      await user.save();
      const resetBaseUrl =
        process.env.RESET_BASE_URL || "https://yourfrontend.com/reset-password";
      const resetUrl = `${resetBaseUrl}/${resetToken}`;
      const htmlcontent = passwordResetTemplate(user.username || "User", resetUrl);
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: htmlcontent,
      });
      return res.json({ message: "If an account with that email exists, a password reset link will be sent." });
    }
    if (token && newPassword) {
      const userWithToken = await User.findOne({
        resetPasswordToken: token,
      });
      if (!userWithToken)
        return res.status(400).json({ message: "Invalid or expired token." });
      userWithToken.password = await (newPassword);
      userWithToken.resetPasswordToken = undefined;
      await userWithToken.save();
      return res.json({ message: "Password reset successfully." });
    }
    return res.status(200).json({
      message: "Password reset successfully. Redirecting to login...",
      redirectUrl: "/login"
    });
    return res.status(400).json({ message: "Invalid request." });
  } catch (error) {
    next(error);
  }
};


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});