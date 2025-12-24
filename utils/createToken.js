import jwt from "jsonwebtoken";
import { env } from "../configs/envSchema";

export const generateToken = (res, user) => {
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES,
    }
  );

//   res.cookie("jwt");

  return token;
};
