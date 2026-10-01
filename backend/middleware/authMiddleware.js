import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** Requires a valid Bearer token. */
export const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorised, no token"));
  }
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new Error("User no longer exists");
    next();
  } catch (err) {
    res.status(401);
    next(new Error("Not authorised, token failed"));
  }
};

/** Attaches req.user when a token is present, but never blocks the request.
 *  Used on checkout so guests can order too. */
export const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      req.user = null;
    }
  }
  next();
};

export const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  res.status(403);
  next(new Error("Admin access only"));
};
