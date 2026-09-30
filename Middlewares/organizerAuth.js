const jwt = require("jsonwebtoken");

const organizerAuth = (req, res, next) => {
  try {
    // 1. Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // 2. Extract the token by removing "Bearer " (if it exists)
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Malformed token",
      });
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check role
    if (decoded.role !== "organizer") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Organizers only",
      });
    }

    // 5. Attach decoded payload to request object
    req.organizer = decoded;

    next();
  } catch (error) {
    // Optional improvement: tell the frontend exactly WHY it failed
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = organizerAuth;