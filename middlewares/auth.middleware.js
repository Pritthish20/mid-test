import jwt from "jsonwebtoken";
import { env } from "../configs/envSchema.js";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  const token = req?.headers?.authorization;

  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }

  // const token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token.trim(), env.JWT_SECRET);

    const userId = decoded?.userId || decoded?._id || decoded?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized, token missing or invalid",
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized, token missing or invalid",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token missing or invalid",
    });
  }
};
