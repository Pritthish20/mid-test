import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: string,
      required: true,
      minLength: [6, "Password must be atleast 6 characters"],
    },
    role: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User",userSchema)

export default User;