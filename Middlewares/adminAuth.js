const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // THIS IS THE FIX: This removes the word "Bearer " before verifying
    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can access this resource.",
      });
    }

    // Saving to req.user so your adminDeleteOrganizer function works properly
    req.user = decoded; 

    next();
  } catch (error) {
    // This will print the exact reason to your terminal if it fails again
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = adminAuth;