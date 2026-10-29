import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = authorization.slice("Bearer ".length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === "string" || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User for authorization token was not found",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authorization token",
      });
    }

    console.error("Authentication error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};