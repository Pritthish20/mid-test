import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import { generateToken } from "../utils/createToken.js";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
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
      sucess: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Signup Failed, Error mesage: ${error}`,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
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
    return res.status(400).json({
      success: false,
      error: `Login Failed, Error mesage: ${error}`,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await User.findOne({_id: req.user._id});
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: `User Profile not Found`,
      });
    }
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Geting User Profile Failed, Error mesage: ${error}`,
    });
  }
};
