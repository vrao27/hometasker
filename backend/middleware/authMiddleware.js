const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // Check if the request has an authorization header
  const authHeader = req.headers["authorization"];

  // Header format should be: "Bearer <token> Extract the token (strip out "Bearer ")
  const token = authHeader && authHeader.split(" ")[1];
    // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    //Decode and verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    
    req.user = decoded; // Now req.user holds the info from the token
    next(); // User is authenticated, move to the route handler
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
