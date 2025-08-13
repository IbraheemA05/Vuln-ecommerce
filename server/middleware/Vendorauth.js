import jwt from "jsonwebtoken";

const vendorAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the user is a vendor
    if (!decoded.role || decoded.role !== "vendor") {
      return res.status(403).json({ message: "Access denied: Vendors only" });
    }

    req.user = decoded; // Attach user info (including role)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default vendorAuth;
