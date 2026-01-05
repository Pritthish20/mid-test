import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import { generateToken } from "../utils/createToken.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const data = {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch)
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });

    const token = generateToken(existingUser);

    const data = {
      token: token,
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user._id).select("-password");

    if (!profile) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized, token missing or invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: profile._id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      },
    });
  } catch {
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
