const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
  next();
};

module.exports = { requireAuth, requireRole };
